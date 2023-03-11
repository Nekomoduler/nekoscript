type TokenType = "lex_static" | "lex_call" | "lex_open" | "lex_close" | "lex_coma";
declare class TokenInput {
    value: string;
    type: TokenType;
    indexAt: number;
    indexEnd: number;
    lineStart: number;
    lineEnd: number;
    constructor(value: string, type: TokenType, indexAt: number, indexEnd: number, lineStart: number, lineEnd: number);
}
declare const TokenGrammar: {
    CALL_OP: string;
    OPEN_OP: string;
    CLOSE_OP: string;
    COMA_OP: string;
};
declare const tokenizeInput: (input: string) => TokenInput[];
export { tokenizeInput, TokenInput, TokenType, TokenGrammar };
