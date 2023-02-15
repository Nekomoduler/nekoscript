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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardLibrary = void 0;
var Component_1 = require("../Component");
var StandardLibrary = /** @class */ (function (_super) {
    __extends(StandardLibrary, _super);
    function StandardLibrary() {
        return _super.call(this, "StandardLibrary", "NekoScript", new Component_1.Version(0, 0, 2)) || this;
    }
    StandardLibrary.prototype.$typeof = function (runtime, node) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var arg;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!node.argument || !(node.argument.Size && ((_a = node.argument.getArgument(0)) === null || _a === void 0 ? void 0 : _a.length)))
                            throw new Error("$typeof requires one argument of object!");
                        node.isUsingArgument = true;
                        return [4 /*yield*/, node.argument.ExecuteArgument(0, runtime)];
                    case 1:
                        arg = _b.sent();
                        return [2 /*return*/, typeof _super.prototype.SafeWrapValue.call(this, arg, { outputAsString: true })];
                }
            });
        });
    };
    StandardLibrary.prototype.$len = function (runtime, node) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var arg, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!node.argument || !(node.argument.Size && ((_a = node.argument.getArgument(0)) === null || _a === void 0 ? void 0 : _a.length)))
                            throw new Error("$len requires one argument of (length/size)-like object");
                        node.isUsingArgument = true;
                        _c = (_b = _super.prototype.SafeWrapValue).call;
                        _d = [this];
                        return [4 /*yield*/, node.argument.ExecuteArgument(0, runtime)];
                    case 1:
                        arg = _c.apply(_b, _d.concat([_e.sent()]));
                        return [2 /*return*/, (arg === null || arg === void 0 ? void 0 : arg.size) || (arg === null || arg === void 0 ? void 0 : arg.length)];
                }
            });
        });
    };
    StandardLibrary.prototype.$set = function (runtime, node) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, key, value;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!node.argument || !(node.argument.Size && ((_a = node.argument.getArgument(0)) === null || _a === void 0 ? void 0 : _a.length)))
                            throw new Error("$get requires one argument of string");
                        node.isUsingArgument = true;
                        return [4 /*yield*/, node.argument.ExecuteAllArgument(runtime)];
                    case 1:
                        _b = _c.sent(), key = _b[0], value = _b[1];
                        // if (!key)
                        //     throw new Error("Variable Key is required to get a value");
                        // No need for this check
                        if (!_super.prototype.isArgumentTypeof.call(this, key, "string"))
                            throw new TypeError("Key of variable must be typeof string!");
                        console.log("Set");
                        runtime
                            .components
                            .Cache
                            // .get(String(super.SafeWrapValue(key, { allowAsString: true })), super.SafeWrapValue(value, { allowAsString: true })); // Improvise
                            .set(this.WrapAsString(key), _super.prototype.SafeWrapValue.call(this, value));
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    StandardLibrary.prototype.$get = function (runtime, node) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!node.argument || !(node.argument.Size && ((_a = node.argument.getArgument(0)) === null || _a === void 0 ? void 0 : _a.length)))
                            throw new Error("$get requires one argument of string");
                        node.isUsingArgument = true;
                        return [4 /*yield*/, node.argument.ExecuteArgument(0, runtime)];
                    case 1:
                        key = (_b.sent())[0];
                        // if (!key)
                        //     throw new Error("Variable Key is required to get a value");
                        // No need for this check
                        if (!_super.prototype.isArgumentTypeof.call(this, key, "string"))
                            throw new TypeError("Key of variable must be typeof string!");
                        console.log("Get");
                        return [2 /*return*/, runtime
                                .components
                                .Cache
                                // .get(String(super.SafeWrapValue(key, { allowAsString: true }))); // Key value in array is all string
                                .get(this.WrapAsString(key))];
                }
            });
        });
    };
    StandardLibrary.prototype.$export = function (runtime, node) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        node.isUsingArgument = true;
                        return [4 /*yield*/, ((_b = (_a = node.argument) === null || _a === void 0 ? void 0 : _a.ExecuteAllArgument) === null || _b === void 0 ? void 0 : _b.call(_a, runtime))];
                    case 1:
                        key = ((_c.sent()) || [])[0];
                        if (!key)
                            throw new Error("Variable Key is required to export a value");
                        runtime.exports[String(_super.prototype.SafeWrapValue.call(this, key, { outputAsString: true }))] = runtime.components.registered_calls.get(String(_super.prototype.SafeWrapValue.call(this, key, { outputAsString: true })));
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    StandardLibrary.prototype.$log = function (runtime, node) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, _c, _d;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!node.argument || !(node.argument.Size && ((_a = node.argument.getArgument(0)) === null || _a === void 0 ? void 0 : _a.length)))
                            throw new Error("$log requires at least one argument of string");
                        node.isUsingArgument = true;
                        _c = (_b = console.log).apply;
                        _d = [console];
                        return [4 /*yield*/, node.argument.ExecuteAllArgument(runtime)];
                    case 1:
                        _c.apply(_b, _d.concat([(_e.sent()).map(function (x) { return _super.prototype.SafeWrapValue.call(_this, x, { outputAsString: true }); })]));
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    StandardLibrary.prototype.$warn = function (runtime, node) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        node.isUsingArgument = true;
                        _d = (_c = console.warn).apply;
                        _e = [console];
                        _g = (_f = _super.prototype.SafeWrapValue).call;
                        _h = [this];
                        return [4 /*yield*/, ((_b = (_a = node.argument) === null || _a === void 0 ? void 0 : _a.ExecuteAllArgument) === null || _b === void 0 ? void 0 : _b.call(_a, runtime))];
                    case 1:
                        _d.apply(_c, _e.concat([_g.apply(_f, _h.concat([_j.sent()]))]));
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    StandardLibrary.prototype.$error = function (runtime, node) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        node.isUsingArgument = true;
                        _d = (_c = console.error).apply;
                        _e = [console];
                        _g = (_f = _super.prototype.SafeWrapValue).call;
                        _h = [this];
                        return [4 /*yield*/, ((_b = (_a = node.argument) === null || _a === void 0 ? void 0 : _a.ExecuteAllArgument) === null || _b === void 0 ? void 0 : _b.call(_a, runtime))];
                    case 1:
                        _d.apply(_c, _e.concat([_g.apply(_f, _h.concat([_j.sent()]))]));
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    StandardLibrary.prototype.$time = function (runtime, node) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var arg, label;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!node.argument || !(node.argument.Size && ((_a = node.argument.getArgument(0)) === null || _a === void 0 ? void 0 : _a.length)))
                            throw new Error("$time requires one argument of string");
                        return [4 /*yield*/, node.argument.ExecuteArgument(0, runtime)];
                    case 1:
                        arg = _b.sent();
                        label = _super.prototype.SafeWrapValue.call(this, arg, { outputAsString: true });
                        if (typeof label !== "string")
                            throw new TypeError("label must be typeof string!");
                        node.isUsingArgument = true;
                        console.time(label);
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    StandardLibrary.prototype.$timeEnd = function (runtime, node) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var arg, label;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!node.argument || !(node.argument.Size && ((_a = node.argument.getArgument(0)) === null || _a === void 0 ? void 0 : _a.length)))
                            throw new Error("$time requires one argument of string");
                        return [4 /*yield*/, node.argument.ExecuteArgument(0, runtime)];
                    case 1:
                        arg = _b.sent();
                        label = _super.prototype.SafeWrapValue.call(this, arg, { outputAsString: true });
                        if (typeof label !== "string")
                            throw new TypeError("label must be typeof string!");
                        node.isUsingArgument = true;
                        console.timeEnd(label);
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    StandardLibrary.prototype.$count = function (runtime, node) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var arg, label;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!node.argument || !(node.argument.Size && ((_a = node.argument.getArgument(0)) === null || _a === void 0 ? void 0 : _a.length)))
                            throw new Error("$time requires one argument of string");
                        return [4 /*yield*/, node.argument.ExecuteArgument(0, runtime)];
                    case 1:
                        arg = _b.sent();
                        label = _super.prototype.SafeWrapValue.call(this, arg, { outputAsString: true });
                        if (typeof label !== "string")
                            throw new TypeError("label must be typeof string!");
                        node.isUsingArgument = true;
                        console.count(label);
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    StandardLibrary.prototype.$countReset = function (runtime, node) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var arg, label;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!node.argument || !(node.argument.Size && ((_a = node.argument.getArgument(0)) === null || _a === void 0 ? void 0 : _a.length)))
                            throw new Error("$time requires one argument of string");
                        return [4 /*yield*/, node.argument.ExecuteArgument(0, runtime)];
                    case 1:
                        arg = _b.sent();
                        label = _super.prototype.SafeWrapValue.call(this, arg, { outputAsString: true });
                        if (typeof label !== "string")
                            throw new TypeError("label must be typeof string!");
                        node.isUsingArgument = true;
                        console.countReset(label);
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    return StandardLibrary;
}(Component_1.Component));
exports.StandardLibrary = StandardLibrary;
