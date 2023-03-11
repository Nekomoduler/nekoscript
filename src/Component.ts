// import { existsSync } from "node:fs";
// import path = require("node:path"); / Removing for browser support
import { NekoLog } from ".";
import { ArgumentChildren } from "./parser";
import { TokenGrammar } from "./tokenize";

class Version {
    private _major: number;
    private _minor: number;
    private _build: number;

    public constructor(
        majorVersion: number, 
        minorVersion: number, 
        buildVersion: number
    ) {
        this._major = majorVersion;
        this._minor = minorVersion;
        this._build = buildVersion;
    }

    public toString(): string {
        return `v${this._major}.${this._minor}.${this._build}`;
    }
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

class Component {
    private _name: string;
    private _author: string;
    private _version: Version;
    private _load: Function;

    [x: string]: any;

    public constructor(name: string, author: string, version: Version, options: ComponentOptions = {}) {
        this._name = name;
        this._author = author;
        this._version = version;
        this._load = options?.onLoad;
    }

    public get Name() {
        return this._name;
    }

    public get Version() {
        return this._version;
    }

    public get Author() {
        return this._author;
    }

    public get onLoad() {
        return this._load;
    }

    public toString() {
        return '';
    }

    // Utilities

    public isArgumentTypeof(argument: ArgumentChildren, type: "string" | "number" | "symbol" | "bigint" | "boolean" | "function" | "object" | "undefined") {
        // Removed in temp for evaluated result support
        // if (! (argument instanceof ArgumentChildren))
        //     throw new TypeError("args must be instanceof ArgumentChildren!");
        if (Array.isArray(argument))
            return argument.every(x => typeof x === type);

        return typeof argument === type;
    }

    private _handleToString(x: any) {
        if (Array.isArray(x))
            return x.join(', ');

        switch (typeof x) {
            case "string": 
            case "number": 
            case "boolean": 
            // case "function":  - Should be handled
            case "bigint":
                return String(x);
            // Add warning for unhandled symbol class
            case "symbol": String(x);
            // Add warning for unhandled object instance
            case "object": String(x);
            // Add warning for unhandled function descriptor
            case "function": String(x);
            case "undefined": String(x);
            default:
                return String(x); // Add warning for unhandled class
        }
    }

    public WrapAsString(argument: ArgumentChildren, joinString = "") {
        // Removed in temp for evaluated result support
        // if (! (argument instanceof ArgumentChildren))
        //     throw new TypeError("args must be instanceof ArgumentChildren!");

        // Added New Lines for better reading
        const handle = this._handleToString;

        if (Array.isArray(argument))
            return argument.map(
                x => Array.isArray(x) ? 

                x.map(y => y.toString ? handle(y) : String(y)).join('') : 

                (x.toString ? handle(x) : String(x))
            )
            .join(joinString);
        
        return this._handleToString(argument);
    }

    public SafeWrapValue(args: any, options: {
        outputAsString?: boolean;
    } = {}) {
        if (!Array.isArray(args))
            return args;

        let str = "";
        let returnResult = [];
        
        while (args.length) {

            let g = args.shift();

            if (g instanceof ArgumentChildren) {
                str += g.join('');
                continue;
            }

            if (typeof g === "string") {
                str += g;
                continue;
            }

            if (str.length > 0)
                returnResult.push(str);
            str = "";
            returnResult.push(g);
        }

        if (str.length > 0)
            returnResult.push(str);
        str = "";

        if (returnResult.length < 2)
            return returnResult.shift();

        // let len = (x) => x?.size || x?.length;

        if (options.outputAsString)
            return returnResult
            // .map(x => typeof x !== "string" ? 

            // `${ x?.constructor?.name }${( len(x) ) ? `(${ len(x) })` : ""} {  }` - Simplify

            //  : x )
            .map(x => this._handleToString(x))
            .join('');

        return returnResult;
    }
}

class CacheModule {
    private cache = new Map<string, any>();

    public get(name: string) {
        return this.cache.get(name);
    }
    public set(name: string, value: any) {
        return this.cache.set(name, value);
    }
    public delete(name: string) {
        return this.cache.delete(name);
    }
    public clear(name: string) {
        return this.cache.clear();
    }
}

class ComponentManager extends Component {
    protected Registered = new Map<string, Component>();
    protected RegisteredMethods = new Map<string, any>();
    protected MethodsFromComponent = new Map<string, Component>();
    protected _cache = new CacheModule();

    public constructor(private readonly _isGlobal?: boolean) {
        super(
            "ComponentManager",
            "NekoModules",
            new Version(1, 0, 0),
        );
    }

    public get cache() {
        return this._cache;
    }

    public getMethod(name: string) {
        return this.RegisteredMethods.get(name);
    }

    public getComponentByName(name: string) {
        return this.MethodsFromComponent.get(name);
    }

    public Register(libName: string, regName: string = "") {
        if (!this.Registered.has(libName)) {
            throw new Error(`Component with name '${libName}' does not exist!`);
        }
        const component = this.Registered.get(libName);
        // Get Entries of object member's / key props
        const entries = Object.entries(component)
        // Concat entries of class prototypes
        .concat(Object.getOwnPropertyNames(Object.getPrototypeOf(component)).map(x => [x, component[x]]))
        // Concat NekoRuntime export
        .concat(component["export"] ? Object.entries(component.export) : [])
        // Filter each entries of key startsWith CALL_OP
        .filter(x => x[0].startsWith("$"));

        for (const [key, value] of entries) {
            if (key === "constructor") continue;
            const formatName = TokenGrammar.CALL_OP + regName + key.slice(1);
            if (this.RegisteredMethods.has(formatName)) {
                NekoLog.Warning(`CMGR (${this.constructor.name}) has conflict name with '${key}', ignoring method register`);
                continue;
            }
            this.RegisteredMethods.set(formatName, value);
            this.MethodsFromComponent.set(formatName, component);
        }
    }

    public Add(component: Component, name?: string) {
        if (this.Registered.has(name) || this.Registered.has(component.Name)) {
            throw new Error(`Component with name ${name || component.Name} is already registered!`);
        }

        this.Registered.set(name || component.Name, component);
        if (this._isGlobal) {
            this.Register(name || component.Name);
            NekoLog.Info(`Global CMGR (${this.constructor.name}) is using ${component.Name} ${component.Version.toString()}`);
        }

        return this;
    }

    public Remove(libName: string) {
        if (!this.Registered.has(libName)) return false;
        const component = this.Registered.get(libName);

        const methodNames = Array.from(this.MethodsFromComponent.entries())
        .filter(([ k, v ]) => v === component)
        .map(([ k ]) => k);

        for (const name in methodNames) {
            this.RegisteredMethods.delete(name);
        }
        this.Registered.delete(libName);

        return true;
    }
}
 
class ComponentExtensions extends Component {
    protected Registered = new Map<string, Component>();
    protected RegisteredMethods = new Map<string, any>();
    protected MethodsFromComponent = new Map<string, Component>();
    protected _cache = new CacheModule();

    // protected static Registered = new Map<string, Component>();

    public constructor(private readonly _isGlobal?: boolean) {
        super("ComponentExtensions", "NekoModules", new Version(1, 0, 0), {
            verbose: true,
            onLoad: ComponentExtensions.warnOnLoad
        });
    }

    public get componentNames() {
        return Array.from(this.Registered.keys())
    }

    public get componentEntries() {
        return Array.from(this.Registered.entries()).map((x) => `${x[0]} - ${x[1].Version.toString()}`)
    }

    public componentVersion(componentName: string) {
        return this.Registered.get(componentName)?.Version?.toString?.();
    }

    public Register(component: Component, asName: string = "") {
        // Get Entries of object member's / key props
        const entries = Object.entries(component)
        // Concat entries of class prototypes
        .concat(Object.getOwnPropertyNames(Object.getPrototypeOf(component)).map(x => [x, component[x]]))
        // Concat NekoRuntime export
        .concat(component["export"] ? Object.entries(component.export) : [])
        // Filter each entries of key startsWith CALL_OP
        .filter(x => x[0].startsWith("$"))

        for (const [key, value] of entries) {
            if (key === "constructor") continue;
            this.RegisteredMethods.set(TokenGrammar.CALL_OP + asName + key.slice(1), value);
            this.MethodsFromComponent.set(TokenGrammar.CALL_OP + asName + key.slice(1), component);
        }
    }

    public using(filename: string, asName: string = "") {
        if (!this._isGlobal && !(typeof asName === "string" && asName?.length))
            throw new Error("non-global use of component module is require to have an asName to avoid conflicts");

        if (this._isGlobal) {
            NekoLog.Info(`Global CEXT (${this.constructor.name}) is using '${filename}'`);
        }

        let component = this.Registered.get(filename);

        if (component) {
            this.Registered.set(asName || filename, component);
            this.Register(component, asName);
            return component;
        }

        /* Removing for broswer support */
        // if (existsSync(path.resolve(filename))) {
        //     // Do something for file imports
        //     return null;
        // }

        throw new Error("unable to find component")
        return void 0;
    }

    public getMethod(name: string) {
        return this.RegisteredMethods.get(name);
    }

    public getComponentFromName(name: string) {
        return this.MethodsFromComponent.get(name);
    }

    public get(componentName: string) {
        return this.Registered.get(componentName);
    }

    public get Cache() {
        return this._cache;
    }

    // Supposed to be static
    public add(component: Component, name: string = "") {
        // if (! (component instanceof Component))
        //     throw new TypeError("invalid instanceof component!");

        if (! (typeof name === "string" && name?.length))
            throw new TypeError("name must be string")

        if (this.Registered.has(name) || this.Registered.has(component.Name)) {
            throw new Error(`component with ${name || component.Name} is already registered in extensions`);
        }

        this.Registered.set(name || component.Name, component);

        return this;
    }

    public remove(componentName: string) {
        return this.Registered.delete(componentName);
    }

    static warnOnLoad() {
        NekoLog.Warning("WARNING: ComponentExtensions is used for managing extensions, component is already provided on use with NekoRuntime!");
    }
}

export {
    Component,
    Version,
    ComponentExtensions,
    ComponentManager
}