"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenGrammar = exports.TokenInput = exports.tokenizeInput = void 0;
var _1 = require(".");
var TokenInput = /** @class */ (function () {
    function TokenInput(value, type, indexAt, indexEnd, lineStart, lineEnd) {
        this.value = value;
        this.type = type;
        this.indexAt = indexAt;
        this.indexEnd = indexEnd;
        this.lineStart = lineStart;
        this.lineEnd = lineEnd;
    }
    return TokenInput;
}());
exports.TokenInput = TokenInput;
var TokenGrammar = {
    CALL_OP: "$",
    OPEN_OP: "[",
    CLOSE_OP: "]",
    COMA_OP: ";"
};
exports.TokenGrammar = TokenGrammar;
var tokenizeInput = function (input) {
    if (!(typeof input === "string" && (input === null || input === void 0 ? void 0 : input.length)))
        throw new TypeError("input must be typeof string!");
    var i = 0;
    var tokens = [];
    var grammar = [
        TokenGrammar.CALL_OP,
        TokenGrammar.OPEN_OP,
        TokenGrammar.CLOSE_OP,
        TokenGrammar.COMA_OP,
        "\\"
    ];
    var type = "lex_static";
    var value = "";
    var index_start = 0;
    var char_start = 0;
    var char_end = 0;
    var line_start = 0;
    var line_end = 0;
    var _type = type;
    var _value = value;
    var characterEscape = false;
    var addNewLine = false;
    for (i = 0; i < input.length; i++) {
        switch (input[i]) {
            case (characterEscape ? input[i] : ''): {
                var _allow = false;
                if (grammar.includes(input[i]))
                    _allow = true;
                _type = "lex_static";
                if (type !== "lex_static") {
                    _value = (_allow ? "" : "\\") + input[i];
                }
                else {
                    _value += (_allow ? "" : "\\") + input[i];
                }
                characterEscape = false;
                break;
            }
            case TokenGrammar.CALL_OP:
                {
                    _type = "lex_call";
                    _value = TokenGrammar.CALL_OP;
                    break;
                }
                ;
            case TokenGrammar.OPEN_OP:
                {
                    _type = "lex_open";
                    _value = TokenGrammar.OPEN_OP;
                    break;
                }
                ;
            case TokenGrammar.CLOSE_OP:
                {
                    _type = "lex_close";
                    _value = TokenGrammar.CLOSE_OP;
                    break;
                }
                ;
            case TokenGrammar.COMA_OP:
                {
                    _type = "lex_coma";
                    _value = TokenGrammar.COMA_OP;
                    break;
                }
                ;
            case "\\":
                {
                    characterEscape = true;
                    break;
                }
                ;
            default: {
                if (input[i] === "\n") {
                    // line_end += 1;
                    addNewLine = true;
                }
                _type = "lex_static";
                if (type !== "lex_static") {
                    _value = input[i];
                }
                else {
                    _value += input[i];
                }
            }
        }
        if ( /*type && */(type !== _type || _type !== "lex_static" || addNewLine)) {
            if ((value === null || value === void 0 ? void 0 : value.length) > 0)
                tokens.push(new TokenInput(value, type, index_start, i, line_start, line_end));
            index_start = i;
            line_start = line_end;
            value = _value;
            type = _type;
            if (addNewLine) {
                line_end += 1;
                _value = "\n";
            }
            addNewLine = false;
            continue;
        }
        value = _value;
    }
    tokens.push(new TokenInput(_value, _type, index_start, i, line_start, line_end));
    if (!tokens[0].value)
        tokens.shift();
    _1.NekoLog.Info("Tokenized code input into ".concat(tokens.length, " tokens"));
    return tokens;
};
exports.tokenizeInput = tokenizeInput;
