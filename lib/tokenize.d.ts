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
declare const tokenizeInput: (input: string) => TokenInput[];
export { tokenizeInput, TokenInput, TokenType };
