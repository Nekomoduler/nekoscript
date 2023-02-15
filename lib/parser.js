"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgumentChildren = exports.ASTNode = exports.CallNode = exports.ArgumentNode = exports.ProgramNode = exports.parseAtom = exports.parseArgument = exports.parse = void 0;
var tokenize_1 = require("./tokenize");
var ASTNode = /** @class */ (function () {
    function ASTNode(value) {
        if (!(value instanceof tokenize_1.TokenInput)) {
            throw new TypeError("Wrong type Token");
        }
        this.indexAt = value.indexAt;
        this.indexEnd = value.indexEnd;
        this.lineStart = value.lineStart;
        this.lineEnd = value.lineEnd;
        this._value = value.value;
    }
    ;
    ASTNode.prototype.toString = function () {
        return this._value;
    };
    ASTNode.prototype.visit = function (runtime) {
        // throw new NotImplementedError("Method not implemented");
        return this._value;
    };
    return ASTNode;
}());
exports.ASTNode = ASTNode;
var CallNode = /** @class */ (function (_super) {
    __extends(CallNode, _super);
    function CallNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CallNode.prototype.visit = function (runtime) {
        var FnResult = runtime.findMethod("".concat(this.toString())); // Trying to find the function
        var FnModule;
        if (!FnResult)
            throw new Error("function called as ".concat(this.toString(), " does not exist in module"));
        FnModule = runtime.findComponent("".concat(this.toString()));
        if (typeof FnResult === "function") {
            FnResult = FnResult.apply(FnModule, [runtime, this]);
        }
        if (this.isUsingArgument || !this.argument)
            return FnResult;
        return FnResult + (this.argument.visit(runtime));
    };
    return CallNode;
}(ASTNode));
exports.CallNode = CallNode;
var ArgumentChildren = /** @class */ (function (_super) {
    __extends(ArgumentChildren, _super);
    function ArgumentChildren() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ArgumentChildren;
}(Array));
exports.ArgumentChildren = ArgumentChildren;
;
var ArgumentNode = /** @class */ (function (_super) {
    __extends(ArgumentNode, _super);
    function ArgumentNode(token, IsClosed) {
        var _this = this;
        if (!(token instanceof tokenize_1.TokenInput)) {
            throw new TypeError("incorrect instance");
        }
        _this = _super.call(this, token) || this;
        _this.IsClosed = IsClosed;
        _this.arguments = [];
        return _this;
    }
    ArgumentNode.prototype.toString = function () {
        return '[' + this.arguments.map(function (x) { return x.map(function (v) { return v.toString(); }).join(''); }).join(';') + (this.IsClosed ? ']' : '');
    };
    ArgumentNode.prototype.push = function () {
        var _a;
        var astTokens = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            astTokens[_i] = arguments[_i];
        }
        return (_a = this.arguments).push.apply(_a, astTokens);
    };
    ArgumentNode.prototype.getManyArguments = function (start, end) {
        return this.arguments.slice(start, end);
    };
    ArgumentNode.prototype.getArgument = function (index) {
        return this.arguments[index];
    };
    ArgumentNode.prototype.ExecuteArgument = function (index, runtime) {
        return this.arguments[index].map(function (x) { return x.visit(runtime); });
    };
    ArgumentNode.prototype.ExecuteAllArgument = function (runtime) {
        var _this = this;
        return this.arguments.map(function (_, xi) { return _this.ExecuteArgument(xi, runtime); });
    };
    Object.defineProperty(ArgumentNode.prototype, "Size", {
        get: function () {
            return this.arguments.length;
        },
        enumerable: false,
        configurable: true
    });
    ArgumentNode.prototype.visit = function (runtime) {
        var result = this.arguments.map(function (x) { return x.map(function (v) { return v.visit(runtime); }).join(''); });
        return "[".concat(result.join(';')).concat(this.IsClosed ? "]" : "");
    };
    return ArgumentNode;
}(ASTNode));
exports.ArgumentNode = ArgumentNode;
var ProgramNode = /** @class */ (function (_super) {
    __extends(ProgramNode, _super);
    function ProgramNode(isStrict) {
        var _this = this;
        var fake = new tokenize_1.TokenInput('', "lex_static", 0, 0, 0, 0);
        _this = _super.call(this, fake) || this;
        _this.arguments = [];
        _this._strict = isStrict;
        return _this;
    }
    ProgramNode.prototype.push = function () {
        var _a;
        var astTokens = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            astTokens[_i] = arguments[_i];
        }
        return (_a = this.arguments).push.apply(_a, astTokens);
    };
    ProgramNode.prototype.toString = function () {
        return this.arguments.map(function (x) { return x.toString(); }).join('');
    };
    ProgramNode.prototype.visit = function (runtime) {
        var result = this.arguments.map(function (x) { return x.visit(runtime); });
        return result.join('');
    };
    return ProgramNode;
}(ASTNode));
exports.ProgramNode = ProgramNode;
/**
 * Lexer Token Input Reader
 *
 * Saved many lifes because of this invention
 */
var LTIReader = /** @class */ (function () {
    function LTIReader(_input, programNode) {
        this._input = _input;
        this.programNode = programNode;
        this.index = 0;
    }
    Object.defineProperty(LTIReader.prototype, "current", {
        get: function () {
            return this.input[this.index];
        },
        enumerable: false,
        configurable: true
    });
    LTIReader.prototype.next = function () {
        this.index += 1;
        return this.index;
    };
    Object.defineProperty(LTIReader.prototype, "input", {
        get: function () {
            return this._input;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LTIReader.prototype, "eof", {
        get: function () {
            return this.index >= this.input.length;
        },
        enumerable: false,
        configurable: true
    });
    return LTIReader;
}());
var parse = function (input) {
    var node = new ProgramNode(null);
    var reader = new LTIReader(input, node);
    while (!reader.eof) {
        var err = parseAtom(reader);
        if (err instanceof Error)
            throw err;
    }
    return node;
};
exports.parse = parse;
var ILG_CALL_REGEX = /\W/;
var parseAtom = function (reader) {
    var _a, _b, _c;
    var node = reader.current;
    switch (node.type /* Atom Parser */) {
        case "lex_call":
            {
                reader.next();
                if (((_a = reader.current) === null || _a === void 0 ? void 0 : _a.type) === "lex_static") {
                    var name_1 = (((_b = reader.current) === null || _b === void 0 ? void 0 : _b.value) || "").split(ILG_CALL_REGEX);
                    if (((_c = reader.current) === null || _c === void 0 ? void 0 : _c.value) === name_1[0]) {
                        reader.next();
                    }
                    else {
                        reader.current.value = name_1.slice(1).join(" ");
                        if (!reader.current.value)
                            reader.next();
                    }
                    node.value += name_1[0];
                    name_1 = void 0;
                    return reader.programNode.push(new CallNode(node));
                }
                return reader.programNode.push(new ASTNode(node));
            }
            ;
        case "lex_static":
            reader.next();
            return reader.programNode.push(new ASTNode(node));
        case "lex_open": {
            var arg = parseArgument(reader);
            var t = reader.programNode.arguments[reader.programNode.arguments.length - 1];
            if (t instanceof CallNode) {
                t.argument = arg;
            }
            else {
                reader.programNode.push(arg);
            }
            return;
        }
        default: return new TypeError("unable to handle token LTT input of '".concat(node.type, "'!"));
    }
};
exports.parseAtom = parseAtom;
var parseArgument = function (reader) {
    var _a, _b, _c;
    var closeNode;
    var instance = new ArgumentNode(reader.current);
    var arg = new ArgumentChildren();
    reader.next();
    while (!reader.eof) {
        var node = reader.current;
        if (node.type === "lex_close") {
            closeNode = node;
            reader.next();
            break;
        }
        if (node.type === "lex_coma") {
            reader.next();
            instance.push(arg);
            arg = new ArgumentChildren();
            continue;
        }
        swicheroo: switch (node.type /* Argument Parser */) {
            case "lex_call":
                {
                    reader.next();
                    if (((_a = reader.current) === null || _a === void 0 ? void 0 : _a.type) === "lex_static") {
                        var name_2 = (((_b = reader.current) === null || _b === void 0 ? void 0 : _b.value) || "").split(ILG_CALL_REGEX);
                        if (((_c = reader.current) === null || _c === void 0 ? void 0 : _c.value) === name_2[0]) {
                            reader.next();
                        }
                        else {
                            reader.current.value = " " + name_2.slice(1).join(" ");
                        }
                        node.value += name_2[0];
                        name_2 = void 0;
                        arg.push(new CallNode(node));
                        break swicheroo;
                    }
                    arg.push(new ASTNode(node));
                    break swicheroo;
                }
                ;
            case "lex_static":
                reader.next();
                arg.push(new ASTNode(node));
                break swicheroo;
            case "lex_open": {
                var parg = parseArgument(reader);
                var t = arg[arg.length - 1];
                if (t instanceof CallNode) {
                    t.argument = parg;
                }
                else {
                    parg.push(arg);
                }
                break swicheroo;
            }
            default: throw new TypeError("unable to handle token LTT input of '".concat(node.type, "' while parsing arg!"));
        }
    }
    instance.push(arg);
    arg = void 0;
    instance.IsClosed = closeNode !== undefined;
    instance.indexEnd = closeNode.indexEnd;
    instance.lineEnd = closeNode.lineEnd;
    return instance;
};
exports.parseArgument = parseArgument;
