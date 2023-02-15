import { ProgramNode, parse } from "./parser";
import { tokenizeInput } from "./tokenize";
import { ComponentExtensions } from "./Component";

class NekoRuntime {
    private _runtimename: string;
    private _running = false;
    private readonly _mainNode: ProgramNode;
    public components: ComponentExtensions;

    public exports: {[x: string]: any} = {};

    static globalComponents: ComponentExtensions = new ComponentExtensions(true);

    public constructor(name: string, ast: ProgramNode) {
        if (! (ast instanceof ProgramNode))
            throw new TypeError("invalid ast type node, require 'program'");
        
        this._mainNode = ast;
        this._runtimename = name;
        this.components = new ComponentExtensions();
    }

    public get Name() {
        return this._runtimename;
    }

    public set Name(v: string) {
        this._runtimename = v;
    }

    public get IsRunning() {
        return this._running;
    }

    public get Global() {
        return NekoRuntime.globalComponents;
    }

    public findMethod(name: string) {
        return NekoRuntime.globalComponents?.getMethod?.(name) || this.components.getMethod(name);
    }

    public findComponent(name: string) {
        return NekoRuntime.globalComponents?.getComponentFromName?.(name) || this.components.getComponentFromName(name);
    }

    public run(runtime: NekoRuntime = this) {
        this._running = true;

        return this._mainNode.visit(runtime);
    }

    static fromInput(runtimeName: string, input: string) {
        const ast = parse(tokenizeInput(input));
        
        return new NekoRuntime(runtimeName, ast);
    }
}

export default NekoRuntime