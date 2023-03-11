"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentManager = exports.ComponentExtensions = exports.Version = exports.Component = void 0;
// import { existsSync } from "node:fs";
// import path = require("node:path"); / Removing for browser support
var _1 = require(".");
var parser_1 = require("./parser");
var tokenize_1 = require("./tokenize");
var Version = /** @class */ (function () {
    function Version(majorVersion, minorVersion, buildVersion) {
        this._major = majorVersion;
        this._minor = minorVersion;
        this._build = buildVersion;
    }
    Version.prototype.toString = function () {
        return "v".concat(this._major, ".").concat(this._minor, ".").concat(this._build);
    };
    return Version;
}());
exports.Version = Version;
var Component = /** @class */ (function () {
    function Component(name, author, version, options) {
        if (options === void 0) { options = {}; }
        this._name = name;
        this._author = author;
        this._version = version;
        this._load = options === null || options === void 0 ? void 0 : options.onLoad;
    }
    Object.defineProperty(Component.prototype, "Name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "Version", {
        get: function () {
            return this._version;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "Author", {
        get: function () {
            return this._author;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "onLoad", {
        get: function () {
            return this._load;
        },
        enumerable: false,
        configurable: true
    });
    Component.prototype.toString = function () {
        return '';
    };
    // Utilities
    Component.prototype.isArgumentTypeof = function (argument, type) {
        // Removed in temp for evaluated result support
        // if (! (argument instanceof ArgumentChildren))
        //     throw new TypeError("args must be instanceof ArgumentChildren!");
        if (Array.isArray(argument))
            return argument.every(function (x) { return typeof x === type; });
        return typeof argument === type;
    };
    Component.prototype._handleToString = function (x) {
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
    };
    Component.prototype.WrapAsString = function (argument, joinString) {
        // Removed in temp for evaluated result support
        // if (! (argument instanceof ArgumentChildren))
        //     throw new TypeError("args must be instanceof ArgumentChildren!");
        if (joinString === void 0) { joinString = ""; }
        // Added New Lines for better reading
        var handle = this._handleToString;
        if (Array.isArray(argument))
            return argument.map(function (x) { return Array.isArray(x) ?
                x.map(function (y) { return y.toString ? handle(y) : String(y); }).join('') :
                (x.toString ? handle(x) : String(x)); })
                .join(joinString);
        return this._handleToString(argument);
    };
    Component.prototype.SafeWrapValue = function (args, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (!Array.isArray(args))
            return args;
        var str = "";
        var returnResult = [];
        while (args.length) {
            var g = args.shift();
            if (g instanceof parser_1.ArgumentChildren) {
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
                .map(function (x) { return _this._handleToString(x); })
                .join('');
        return returnResult;
    };
    return Component;
}());
exports.Component = Component;
var CacheModule = /** @class */ (function () {
    function CacheModule() {
        this.cache = new Map();
    }
    CacheModule.prototype.get = function (name) {
        return this.cache.get(name);
    };
    CacheModule.prototype.set = function (name, value) {
        return this.cache.set(name, value);
    };
    CacheModule.prototype.delete = function (name) {
        return this.cache.delete(name);
    };
    CacheModule.prototype.clear = function (name) {
        return this.cache.clear();
    };
    return CacheModule;
}());
var ComponentManager = /** @class */ (function (_super) {
    __extends(ComponentManager, _super);
    function ComponentManager(_isGlobal) {
        var _this = _super.call(this, "ComponentManager", "NekoModules", new Version(1, 0, 0)) || this;
        _this._isGlobal = _isGlobal;
        _this.Registered = new Map();
        _this.RegisteredMethods = new Map();
        _this.MethodsFromComponent = new Map();
        _this._cache = new CacheModule();
        return _this;
    }
    Object.defineProperty(ComponentManager.prototype, "cache", {
        get: function () {
            return this._cache;
        },
        enumerable: false,
        configurable: true
    });
    ComponentManager.prototype.getMethod = function (name) {
        return this.RegisteredMethods.get(name);
    };
    ComponentManager.prototype.getComponentByName = function (name) {
        return this.MethodsFromComponent.get(name);
    };
    ComponentManager.prototype.Register = function (libName, regName) {
        if (regName === void 0) { regName = ""; }
        if (!this.Registered.has(libName)) {
            throw new Error("Component with name '".concat(libName, "' does not exist!"));
        }
        var component = this.Registered.get(libName);
        // Get Entries of object member's / key props
        var entries = Object.entries(component)
            // Concat entries of class prototypes
            .concat(Object.getOwnPropertyNames(Object.getPrototypeOf(component)).map(function (x) { return [x, component[x]]; }))
            // Concat NekoRuntime export
            .concat(component["export"] ? Object.entries(component.export) : [])
            // Filter each entries of key startsWith CALL_OP
            .filter(function (x) { return x[0].startsWith("$"); });
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var _a = entries_1[_i], key = _a[0], value = _a[1];
            if (key === "constructor")
                continue;
            var formatName = tokenize_1.TokenGrammar.CALL_OP + regName + key.slice(1);
            if (this.RegisteredMethods.has(formatName)) {
                _1.NekoLog.Warning("CMGR (".concat(this.constructor.name, ") has conflict name with '").concat(key, "', ignoring method register"));
                continue;
            }
            this.RegisteredMethods.set(formatName, value);
            this.MethodsFromComponent.set(formatName, component);
        }
    };
    ComponentManager.prototype.Add = function (component, name) {
        if (this.Registered.has(name) || this.Registered.has(component.Name)) {
            throw new Error("Component with name ".concat(name || component.Name, " is already registered!"));
        }
        this.Registered.set(name || component.Name, component);
        if (this._isGlobal) {
            this.Register(name || component.Name);
            _1.NekoLog.Info("Global CMGR (".concat(this.constructor.name, ") is using ").concat(component.Name, " ").concat(component.Version.toString()));
        }
        return this;
    };
    ComponentManager.prototype.Remove = function (libName) {
        if (!this.Registered.has(libName))
            return false;
        var component = this.Registered.get(libName);
        var methodNames = Array.from(this.MethodsFromComponent.entries())
            .filter(function (_a) {
            var k = _a[0], v = _a[1];
            return v === component;
        })
            .map(function (_a) {
            var k = _a[0];
            return k;
        });
        for (var name_1 in methodNames) {
            this.RegisteredMethods.delete(name_1);
        }
        this.Registered.delete(libName);
        return true;
    };
    return ComponentManager;
}(Component));
exports.ComponentManager = ComponentManager;
var ComponentExtensions = /** @class */ (function (_super) {
    __extends(ComponentExtensions, _super);
    // protected static Registered = new Map<string, Component>();
    function ComponentExtensions(_isGlobal) {
        var _this = _super.call(this, "ComponentExtensions", "NekoModules", new Version(1, 0, 0), {
            verbose: true,
            onLoad: ComponentExtensions.warnOnLoad
        }) || this;
        _this._isGlobal = _isGlobal;
        _this.Registered = new Map();
        _this.RegisteredMethods = new Map();
        _this.MethodsFromComponent = new Map();
        _this._cache = new CacheModule();
        return _this;
    }
    Object.defineProperty(ComponentExtensions.prototype, "componentNames", {
        get: function () {
            return Array.from(this.Registered.keys());
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ComponentExtensions.prototype, "componentEntries", {
        get: function () {
            return Array.from(this.Registered.entries()).map(function (x) { return "".concat(x[0], " - ").concat(x[1].Version.toString()); });
        },
        enumerable: false,
        configurable: true
    });
    ComponentExtensions.prototype.componentVersion = function (componentName) {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.Registered.get(componentName)) === null || _a === void 0 ? void 0 : _a.Version) === null || _b === void 0 ? void 0 : _b.toString) === null || _c === void 0 ? void 0 : _c.call(_b);
    };
    ComponentExtensions.prototype.Register = function (component, asName) {
        if (asName === void 0) { asName = ""; }
        // Get Entries of object member's / key props
        var entries = Object.entries(component)
            // Concat entries of class prototypes
            .concat(Object.getOwnPropertyNames(Object.getPrototypeOf(component)).map(function (x) { return [x, component[x]]; }))
            // Concat NekoRuntime export
            .concat(component["export"] ? Object.entries(component.export) : [])
            // Filter each entries of key startsWith CALL_OP
            .filter(function (x) { return x[0].startsWith("$"); });
        for (var _i = 0, entries_2 = entries; _i < entries_2.length; _i++) {
            var _a = entries_2[_i], key = _a[0], value = _a[1];
            if (key === "constructor")
                continue;
            this.RegisteredMethods.set(tokenize_1.TokenGrammar.CALL_OP + asName + key.slice(1), value);
            this.MethodsFromComponent.set(tokenize_1.TokenGrammar.CALL_OP + asName + key.slice(1), component);
        }
    };
    ComponentExtensions.prototype.using = function (filename, asName) {
        if (asName === void 0) { asName = ""; }
        if (!this._isGlobal && !(typeof asName === "string" && (asName === null || asName === void 0 ? void 0 : asName.length)))
            throw new Error("non-global use of component module is require to have an asName to avoid conflicts");
        if (this._isGlobal) {
            _1.NekoLog.Info("Global CEXT (".concat(this.constructor.name, ") is using '").concat(filename, "'"));
        }
        var component = this.Registered.get(filename);
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
        throw new Error("unable to find component");
        return void 0;
    };
    ComponentExtensions.prototype.getMethod = function (name) {
        return this.RegisteredMethods.get(name);
    };
    ComponentExtensions.prototype.getComponentFromName = function (name) {
        return this.MethodsFromComponent.get(name);
    };
    ComponentExtensions.prototype.get = function (componentName) {
        return this.Registered.get(componentName);
    };
    Object.defineProperty(ComponentExtensions.prototype, "Cache", {
        get: function () {
            return this._cache;
        },
        enumerable: false,
        configurable: true
    });
    // Supposed to be static
    ComponentExtensions.prototype.add = function (component, name) {
        // if (! (component instanceof Component))
        //     throw new TypeError("invalid instanceof component!");
        if (name === void 0) { name = ""; }
        if (!(typeof name === "string" && (name === null || name === void 0 ? void 0 : name.length)))
            throw new TypeError("name must be string");
        if (this.Registered.has(name) || this.Registered.has(component.Name)) {
            throw new Error("component with ".concat(name || component.Name, " is already registered in extensions"));
        }
        this.Registered.set(name || component.Name, component);
        return this;
    };
    ComponentExtensions.prototype.remove = function (componentName) {
        return this.Registered.delete(componentName);
    };
    ComponentExtensions.warnOnLoad = function () {
        _1.NekoLog.Warning("WARNING: ComponentExtensions is used for managing extensions, component is already provided on use with NekoRuntime!");
    };
    return ComponentExtensions;
}(Component));
exports.ComponentExtensions = ComponentExtensions;
