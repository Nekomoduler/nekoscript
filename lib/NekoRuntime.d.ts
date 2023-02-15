import { ProgramNode } from "./parser";
import { ComponentExtensions } from "./Component";
declare class NekoRuntime {
    private _runtimename;
    private _running;
    private readonly _mainNode;
    components: ComponentExtensions;
    exports: {
        [x: string]: any;
    };
    static globalComponents: ComponentExtensions;
    constructor(name: string, ast: ProgramNode);
    get Name(): string;
    set Name(v: string);
    get IsRunning(): boolean;
    get Global(): ComponentExtensions;
    findMethod(name: string): any;
    findComponent(name: string): import("./Component").Component;
    run(runtime?: NekoRuntime): string;
    static fromInput(runtimeName: string, input: string): NekoRuntime;
}
export default NekoRuntime;
