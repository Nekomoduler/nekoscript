"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./parser");
var tokenize_1 = require("./tokenize");
var Component_1 = require("./Component");
var _1 = require(".");
var NekoRuntime = /** @class */ (function () {
    function NekoRuntime(name, ast) {
        this._running = false;
        this.exports = {};
        if (!(ast instanceof parser_1.ProgramNode))
            throw new TypeError("invalid ast type node, require 'program'");
        _1.NekoLog.Info("Created runtime with name ".concat(name));
        this._mainNode = ast;
        this._runtimename = name;
        this.components = new Component_1.ComponentManager();
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
        return NekoRuntime.globalComponents.getMethod(name) || this.components.getMethod(name);
    };
    NekoRuntime.prototype.findComponent = function (name) {
        return NekoRuntime.globalComponents.getComponentByName(name) || this.components.getComponentFromName(name);
    };
    NekoRuntime.prototype.run = function (runtime) {
        if (runtime === void 0) { runtime = this; }
        this._running = true;
        return this._mainNode.visit(runtime);
    };
    NekoRuntime.fromInput = function (runtimeName, input) {
        if (!(typeof runtimeName === "string" && (runtimeName === null || runtimeName === void 0 ? void 0 : runtimeName.length) > 5))
            throw new Error("runtimeName must be typeof non-empty string!");
        var ast = (0, parser_1.parse)((0, tokenize_1.tokenizeInput)(input));
        return new NekoRuntime(runtimeName, ast);
    };
    NekoRuntime.globalComponents = new Component_1.ComponentManager(true);
    return NekoRuntime;
}());
exports.default = NekoRuntime;
