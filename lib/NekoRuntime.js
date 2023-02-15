"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./parser");
var tokenize_1 = require("./tokenize");
var Component_1 = require("./Component");
var NekoRuntime = /** @class */ (function () {
    function NekoRuntime(name, ast) {
        this._running = false;
        this.exports = {};
        if (!(ast instanceof parser_1.ProgramNode))
            throw new TypeError("invalid ast type node, require 'program'");
        this._mainNode = ast;
        this._runtimename = name;
        this.components = new Component_1.ComponentExtensions();
    }
    Object.defineProperty(NekoRuntime.prototype, "Name", {
        get: function () {
            return this._runtimename;
        },
        set: function (v) {
            this._runtimename = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NekoRuntime.prototype, "IsRunning", {
        get: function () {
            return this._running;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NekoRuntime.prototype, "Global", {
        get: function () {
            return NekoRuntime.globalComponents;
        },
        enumerable: false,
        configurable: true
    });
    NekoRuntime.prototype.findMethod = function (name) {
        var _a, _b;
        return ((_b = (_a = NekoRuntime.globalComponents) === null || _a === void 0 ? void 0 : _a.getMethod) === null || _b === void 0 ? void 0 : _b.call(_a, name)) || this.components.getMethod(name);
    };
    NekoRuntime.prototype.findComponent = function (name) {
        var _a, _b;
        return ((_b = (_a = NekoRuntime.globalComponents) === null || _a === void 0 ? void 0 : _a.getComponentFromName) === null || _b === void 0 ? void 0 : _b.call(_a, name)) || this.components.getComponentFromName(name);
    };
    NekoRuntime.prototype.run = function (runtime) {
        if (runtime === void 0) { runtime = this; }
        this._running = true;
        return this._mainNode.visit(runtime);
    };
    NekoRuntime.fromInput = function (runtimeName, input) {
        var ast = (0, parser_1.parse)((0, tokenize_1.tokenizeInput)(input));
        return new NekoRuntime(runtimeName, ast);
    };
    NekoRuntime.globalComponents = new Component_1.ComponentExtensions(true);
    return NekoRuntime;
}());
exports.default = NekoRuntime;
