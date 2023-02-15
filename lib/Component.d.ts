import { ArgumentChildren } from "./parser";
declare class Version {
    private _major;
    private _minor;
    private _build;
    constructor(majorVersion: number, minorVersion: number, buildVersion: number);
    toString(): string;
}
declare interface ComponentOptions {
    /**
     * Allows the run of function within options named on property called {@link ComponentOptions.onLoad} on registered
     */
    verbose?: boolean;
    /**
     * Function that calls upon being registered to {@link ComponentExtensions}
     */
    onLoad?: Function;
}
declare class Component {
    private _name;
    private _author;
    private _version;
    private _load;
    [x: string]: any;
    constructor(name: string, author: string, version: Version, options?: ComponentOptions);
    get Name(): string;
    get Version(): Version;
    get Author(): string;
    get onLoad(): Function;
    toString(): string;
    isArgumentTypeof(argument: ArgumentChildren, type: "string" | "number" | "symbol" | "bigint" | "boolean" | "function" | "object" | "undefined"): boolean;
    private _handleToString;
    WrapAsString(argument: ArgumentChildren, joinString?: string): string;
    /**
     * Requires improvements
     */
    SafeWrapValue(args: any, options?: {
        outputAsString?: boolean;
    }): any;
}
declare class CacheModule {
    private cache;
    get(name: string): any;
    set(name: string, value: any): Map<string, any>;
    delete(name: string): boolean;
    clear(name: string): void;
}
declare class ComponentExtensions extends Component {
    private readonly _isGlobal?;
    protected Registered: Map<string, Component>;
    protected RegisteredMethods: Map<string, any>;
    protected MethodsFromComponent: Map<string, Component>;
    protected _cache: CacheModule;
    constructor(_isGlobal?: boolean);
    get componentNames(): string[];
    get componentEntries(): string[];
    componentVersion(componentName: string): string;
    Register(component: Component, asName: string): void;
    Using(filename: string, asName?: string): Component;
    getMethod(name: string): any;
    getComponentFromName(name: string): Component;
    get(componentName: string): Component;
    get Cache(): CacheModule;
    add(component: Component, name?: string): this;
    remove(componentName: string): boolean;
    static warnOnLoad(): void;
}
export { Component, Version, ComponentExtensions };
