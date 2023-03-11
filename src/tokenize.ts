import { NekoLog } from ".";

type TokenType = "lex_static" | "lex_call" | "lex_open" | "lex_close" | "lex_coma";

class TokenInput {
    constructor(
        public value: string, 
        public type: TokenType, 
        public indexAt: number, 
        public indexEnd: number, 
        public lineStart: number, 
        public lineEnd: number
        ) {

    }
}

const TokenGrammar = {
    CALL_OP: "$",
    OPEN_OP: "[",
    CLOSE_OP: "]",
    COMA_OP: ";"
}

const tokenizeInput = (input: string) => {
    if (! (typeof input === "string" && input?.length))
        throw new TypeError("input must be typeof string!");

    let i = 0;
    let tokens: TokenInput[] = [];
    const grammar = [
        TokenGrammar.CALL_OP,
        TokenGrammar.OPEN_OP,
        TokenGrammar.CLOSE_OP,
        TokenGrammar.COMA_OP,
        "\\"
    ]

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
                if (grammar.includes(input[i]))
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
            case TokenGrammar.CALL_OP: {
                _type = "lex_call";
                _value = TokenGrammar.CALL_OP;

                break;
            };
            case TokenGrammar.OPEN_OP: {
                _type = "lex_open";
                _value = TokenGrammar.OPEN_OP;

                break;
            };
            case TokenGrammar.CLOSE_OP: {
                _type = "lex_close";
                _value = TokenGrammar.CLOSE_OP;

                break;
            };
            case TokenGrammar.COMA_OP: {
                _type = "lex_coma";
                _value = TokenGrammar.COMA_OP;

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

    NekoLog.Info(`Tokenized code input into ${tokens.length} tokens`);

    return tokens;
}

export {
    tokenizeInput,
    TokenInput,
    TokenType,
    TokenGrammar
}