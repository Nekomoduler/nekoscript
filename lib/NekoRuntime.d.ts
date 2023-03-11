import { ProgramNode } from "./parser";
import { ComponentManager } from "./Component";
declare class NekoRuntime {
    private _runtimename;
    private _running;
    private readonly _mainNode;
    components: ComponentManager;
    exports: {
        [x: string]: any;
    };
    static globalComponents: ComponentManager;
    constructor(name: string, ast: ProgramNode);
    get Name(): string;
    set Name(v: string);
    get IsRunning(): boolean;
    get Global(): ComponentManager;
    findMethod(name: string): any;
    findComponent(name: string): any;
    run(runtime?: NekoRuntime): Promise<string>;
    static fromInput(runtimeName: string, input: string): NekoRuntime;
}
export default NekoRuntime;
