import NekoRuntime from "./NekoRuntime";
import { TokenInput as LexerTokenInput } from "./tokenize";
declare class ASTNode {
    private readonly _value;
    readonly indexAt: number;
    indexEnd: number;
    readonly lineStart: number;
    lineEnd: number;
    constructor(value: LexerTokenInput);
    toString(): string;
    visit(runtime: NekoRuntime): any;
}
declare class CallNode extends ASTNode {
    argument?: ArgumentNode;
    isUsingArgument: boolean;
    visit(runtime: NekoRuntime): any;
}
declare class ArgumentChildren extends Array<ASTNode> {
}
declare class ArgumentNode extends ASTNode {
    IsClosed?: boolean;
    readonly arguments: (ArgumentChildren)[];
    constructor(token: LexerTokenInput, IsClosed?: boolean);
    toString(): string;
    push(...astTokens: ASTNode[][]): number;
    getManyArguments(start?: number, end?: number): ArgumentChildren[];
    getArgument(index: number): ArgumentChildren;
    ExecuteArgument(index: number, runtime: NekoRuntime): any[];
    ExecuteAllArgument(runtime: NekoRuntime): any[][];
    get Size(): number;
    visit(runtime: NekoRuntime): string;
}
declare class ProgramNode extends ASTNode {
    private readonly _strict;
    readonly arguments: ASTNode[];
    constructor(isStrict: boolean);
    push(...astTokens: ASTNode[]): number;
    toString(): string;
    visit(runtime: NekoRuntime): string;
}
/**
 * Lexer Token Input Reader
 *
 * Saved many lifes because of this invention
 */
declare class LTIReader {
    private _input;
    programNode: ProgramNode;
    index: number;
    constructor(_input: LexerTokenInput[], programNode: ProgramNode);
    get current(): LexerTokenInput;
    next(): number;
    get input(): LexerTokenInput[];
    get eof(): boolean;
}
declare const parse: (input: LexerTokenInput[]) => ProgramNode;
declare const parseAtom: (reader: LTIReader) => number | TypeError;
declare const parseArgument: (reader: LTIReader) => ArgumentNode;
export { parse, parseArgument, parseAtom, ProgramNode, ArgumentNode, CallNode, ASTNode, ArgumentChildren };
