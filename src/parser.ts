import type { Component } from "./Component";
import { NotImplementedError } from "./errors";
import NekoRuntime from "./NekoRuntime";
import { TokenInput as LexerTokenInput, TokenType as LTT } from "./tokenize";

class ASTNode {
    private readonly _value: string;
    public readonly indexAt: number;
    public indexEnd: number;
    public readonly lineStart: number;
    public lineEnd: number;
    public constructor(value: LexerTokenInput) {
        if (! (value instanceof LexerTokenInput)) {
            throw new TypeError("Wrong type Token");
        }

        this.indexAt = value.indexAt;
        this.indexEnd = value.indexEnd;
        this.lineStart = value.lineStart;
        this.lineEnd = value.lineEnd;
        this._value = value.value;
    };

    public toString(): string {
        return this._value;
    }

    public visit(runtime: NekoRuntime): any {
        // throw new NotImplementedError("Method not implemented");
        return this._value;
    }
}

class CallNode extends ASTNode {
    public argument?: ArgumentNode;
    public isUsingArgument: boolean;
    public async visit(runtime: NekoRuntime) {
        let FnResult = runtime.findMethod(`${this.toString()}`); // Trying to find the function
        let FnModule: Component;

        if (!FnResult)
            throw new Error(`function called as ${this.toString()} does not exist in module`);

        FnModule = runtime.findComponent(`${this.toString()}`);

        if (typeof FnResult === "function") {
            FnResult = FnResult.apply(FnModule, [runtime, this]);
        }

        if (FnResult instanceof Promise && typeof FnResult?.then === "function") {
            FnResult = await FnResult;
            // Add catch
        }

        if (this.isUsingArgument || !this.argument)
                return FnResult;

        return FnResult + (this.argument.visit(runtime));
    }
}

class ArgumentChildren extends Array<ASTNode> {};

class ArgumentNode extends ASTNode {
    public readonly arguments: (ArgumentChildren)[] = []; 
    public constructor (token: LexerTokenInput, public IsClosed?: boolean) {
        if (! (token instanceof LexerTokenInput)) {
            throw new TypeError("incorrect instance");
        }

        super(token);
    }
    
    public toString(): string {
        return '[' + this.arguments.map(x => x.map(v => v.toString()).join('')).join(';') + (this.IsClosed ? ']' : '');
    }

    public push(...astTokens: ASTNode[][]) {
        return this.arguments.push(...astTokens);
    }

    public getManyArguments(start?: number, end?: number) {
        return this.arguments.slice(start, end);
    }

    public getArgument(index: number) {
        return this.arguments[index];
    }

    public async ExecuteArgument(index: number, runtime: NekoRuntime) {
        // return Promise.all(this.arguments[index].map(
        //     x => x.visit(runtime)
        // ));

        const result = [];
        for (const item of this.arguments[index]) {
            result.push(await item.visit(runtime));
        }

        return result;
    }


    public async ExecuteAllArgument(runtime: NekoRuntime) {
        // return Promise.all(this.arguments.map(
        //     async (_, xi) => await this.ExecuteArgument(xi, runtime)
        // ));
        const result = [];
        for (let i = 0; i < this.arguments.length; i++) {
            result.push(await this.ExecuteArgument(i, runtime));
        }

        return result;
    }

    public get Size() {
        return this.arguments.length;
    }

    public async visit(runtime: NekoRuntime) {
        // const result = await Promise.all(this.arguments.map(
        //     async x => ( await Promise.all(x.map(v => v.visit(runtime))) ).join('')
        // ));

        const result = (await this.ExecuteAllArgument(runtime)).map(x => x?.join?.(''));

        return `[${result.join(';')}${this.IsClosed ? "]" : ""}`;
    }
}

class ProgramNode extends ASTNode {
    private readonly _strict: boolean;
    public readonly arguments: ASTNode[] = [];
    public constructor(isStrict: boolean) {
        const fake = new LexerTokenInput('', "lex_static", 0, 0, 0, 0);
        super(fake);

        this._strict = isStrict;
    }

    public push(...astTokens: ASTNode[]) {
        return this.arguments.push(...astTokens);
    }

    public toString(): string {
        return this.arguments.map(x => x.toString()).join('');
    }

    public async visit(runtime: NekoRuntime) {
        // const result = await Promise.all(this.arguments.map(x => x.visit(runtime)));
        const result = [];
        for (const item of this.arguments) {
            result.push(await item.visit(runtime));
        }

        return result.join('');
    }
}

/**
 * Lexer Token Input Reader
 * 
 * Saved many lifes because of this invention
 */
class LTIReader {
    public index: number = 0;
    public constructor(private _input: LexerTokenInput[], public programNode: ProgramNode) {}

    public get current() {
        return this.input[this.index];
    }
    public next() {
        this.index += 1;
        return this.index;
    }
    public get input() {
        return this._input;
    }
    public get eof() {
        return this.index >= this.input.length;
    }
}

const parse = (input: LexerTokenInput[]) => {
    const node = new ProgramNode(null);
    const reader = new LTIReader(input, node);

    while (!reader.eof) {
        const err: any = parseAtom(reader);

        if (err instanceof Error)
            throw err;
    }

    return node;
}

const ILG_CALL_REGEX = /\W/;

const parseAtom = (reader: LTIReader) => {
    const node = reader.current;

    switch (node.type /* Atom Parser */) {
        case "lex_call": {
            reader.next();
            if (reader.current?.type === "lex_static") {
                let name = (reader.current?.value || "").split(ILG_CALL_REGEX);
                if (reader.current?.value === name[0]) {
                    reader.next();
                } else {
                    reader.current.value = name.slice(1).join(" ");
                    if (!reader.current.value)
                        reader.next();
                }

                node.value += name[0];
                name = void 0;
                return reader.programNode.push(new CallNode(node))
            }
            return reader.programNode.push(new ASTNode(node))
        };
        case "lex_static": reader.next(); return reader.programNode.push(new ASTNode(node));
        case "lex_open": {
            const arg = parseArgument(reader);
            const t: CallNode = reader.programNode.arguments[reader.programNode.arguments.length - 1] as any;
            if (t instanceof CallNode) {
                t.argument = arg;
            } else {
                reader.programNode.push(arg);
            }

            return;
        }
        
        default: return new TypeError(`unable to handle token LTT input of '${node.type}'!`);
    }
}

const parseArgument = (reader: LTIReader) => {
    let closeNode: LexerTokenInput;
    let instance = new ArgumentNode(reader.current);
    let arg = new ArgumentChildren();
    reader.next();
    while (!reader.eof) {
        const node = reader.current;
        
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

        swicheroo:
        switch (node.type /* Argument Parser */) {
            case "lex_call": {
                reader.next();
                if (reader.current?.type === "lex_static") {
                    let name = (reader.current?.value || "").split(ILG_CALL_REGEX);
                    if (reader.current?.value === name[0]) {
                        reader.next();
                    } else {
                        reader.current.value = " " + name.slice(1).join(" ");
                    }
    
                    node.value += name[0];
                    name = void 0;
                    arg.push(new CallNode(node));
                    break swicheroo;
                }
                arg.push(new ASTNode(node));
                break swicheroo;
            };
            case "lex_static": reader.next(); arg.push(new ASTNode(node)); break swicheroo;
            case "lex_open": {
                const parg = parseArgument(reader);
                const t: CallNode = arg[arg.length - 1] as any;
                if (t instanceof CallNode) {
                    t.argument = parg;
                } else {
                    parg.push(arg);
                }
    
                break swicheroo;
            }
            
            default: throw new TypeError(`unable to handle token LTT input of '${node.type}' while parsing arg!`);
        }
    }

    instance.push(arg);
    arg = void 0;

    instance.IsClosed = closeNode !== undefined;
    instance.indexEnd = closeNode.indexEnd;
    instance.lineEnd = closeNode.lineEnd;
    return instance;
}

export {
    parse,
    parseArgument,
    parseAtom,
    ProgramNode,
    ArgumentNode,
    CallNode,
    ASTNode,
    ArgumentChildren
}