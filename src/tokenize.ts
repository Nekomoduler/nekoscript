type TokenType = "lex_static" | "lex_call" | "lex_open" | "lex_close" | "lex_coma";

class TokenInput {
    constructor(public value: string, public type: TokenType, public indexAt: number, public indexEnd: number, public lineStart: number, public lineEnd: number) {

    }
}

const tokenizeInput = (input: string) => {
    let i = 0;
    let tokens: TokenInput[] = [];

    let type: TokenType = "lex_static";
    let value: string = "";
    let index_start = 0;
    let char_start = 0;
    let char_end = 0;
    let line_start = 0;
    let line_end = 0;

    let _type: TokenType = type;
        let _value: string = value;
        let characterEscape = false;
        let addNewLine = false;
    
    for (i = 0; i < input.length; i++) {

        switch(input[i]) {
            case (characterEscape ? input[i] : ''): {
                let _allow = false;
                if (["$", "[", "]", ";", "\\"].includes(input[i]))
                    _allow = true;
                _type = "lex_static";
                if (type !== "lex_static") {
                    _value = (_allow ? "" : "\\") + input[i]
                } else {
                    _value += (_allow ? "" : "\\") + input[i]
                }

                characterEscape = false;
                break;
            }
            case "$": {
                _type = "lex_call";
                _value = "$";

                break;
            };
            case "[": {
                _type = "lex_open";
                _value = "[";

                break;
            };
            case "]": {
                _type = "lex_close";
                _value = "]";

                break;
            };
            case ";": {
                _type = "lex_coma";
                _value = ";";

                break;
            };
            case "\\": {
                characterEscape = true;
                break;
            };
            default: {
                if (input[i] === "\n") {
                    // line_end += 1;
                    addNewLine = true;
                }
                
                _type = "lex_static";
                if (type !== "lex_static") {
                    _value = input[i];
                } else {
                    _value += input[i]
                }
            }
        }

        if (/*type && */(type !== _type || _type !== "lex_static" || addNewLine)) {
            if (value?.length > 0)
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
}

export {
    tokenizeInput,
    TokenInput,
    TokenType
}