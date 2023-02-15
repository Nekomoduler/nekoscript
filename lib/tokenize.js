"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenInput = exports.tokenizeInput = void 0;
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
var tokenizeInput = function (input) {
    var i = 0;
    var tokens = [];
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
                if (["$", "[", "]", ";", "\\"].includes(input[i]))
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
            case "$":
                {
                    _type = "lex_call";
                    _value = "$";
                    break;
                }
                ;
            case "[":
                {
                    _type = "lex_open";
                    _value = "[";
                    break;
                }
                ;
            case "]":
                {
                    _type = "lex_close";
                    _value = "]";
                    break;
                }
                ;
            case ";":
                {
                    _type = "lex_coma";
                    _value = ";";
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
    return tokens;
};
exports.tokenizeInput = tokenizeInput;
