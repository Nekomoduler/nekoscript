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
exports.StandardLibrary = void 0;
var Component_1 = require("../Component");
var StandardLibrary = /** @class */ (function (_super) {
    __extends(StandardLibrary, _super);
    function StandardLibrary() {
        return _super.call(this, "StandardLibrary", "NekoScript", new Component_1.Version(1, 0, 0)) || this;
    }
    StandardLibrary.prototype.$typeof = function (runtime, node) {
        var _a;
        if (!node.argument || !(node.argument.Size && ((_a = node.argument.getArgument(0)) === null || _a === void 0 ? void 0 : _a.length)))
            throw new Error("$typeof requires one argument of object!");
        node.isUsingArgument = true;
        return typeof _super.prototype.SafeWrapValue.call(this, node.argument.ExecuteArgument(0, runtime), { outputAsString: true });
    };
    StandardLibrary.prototype.$len = function (runtime, node) {
        var _a;
        if (!node.argument || !(node.argument.Size && ((_a = node.argument.getArgument(0)) === null || _a === void 0 ? void 0 : _a.length)))
            throw new Error("$len requires one argument of (length/size)-like object");
        node.isUsingArgument = true;
        var arg = _super.prototype.SafeWrapValue.call(this, node.argument.ExecuteArgument(0, runtime));
        return (arg === null || arg === void 0 ? void 0 : arg.size) || (arg === null || arg === void 0 ? void 0 : arg.length);
    };
    StandardLibrary.prototype.$set = function (runtime, node) {
        var _a, _b, _c;
        if (!node.argument || !(node.argument.Size && ((_a = node.argument.getArgument(0)) === null || _a === void 0 ? void 0 : _a.length)))
            throw new Error("$get requires one argument of string");
        node.isUsingArgument = true;
        var _d = (_c = (_b = node.argument) === null || _b === void 0 ? void 0 : _b.ExecuteAllArgument) === null || _c === void 0 ? void 0 : _c.call(_b, runtime), key = _d[0], value = _d[1];
        // if (!key)
        //     throw new Error("Variable Key is required to get a value");
        // No need for this check
        if (!_super.prototype.isArgumentTypeof.call(this, key, "string"))
            throw new TypeError("Key of variable must be typeof string!");
        runtime
            .components
            .Cache
            // .get(String(super.SafeWrapValue(key, { allowAsString: true })), super.SafeWrapValue(value, { allowAsString: true })); // Improvise
            .set(this.WrapAsString(key), _super.prototype.SafeWrapValue.call(this, value));
        return '';
    };
    StandardLibrary.prototype.$get = function (runtime, node) {
        var _a;
        if (!node.argument || !(node.argument.Size && ((_a = node.argument.getArgument(0)) === null || _a === void 0 ? void 0 : _a.length)))
            throw new Error("$get requires one argument of string");
        node.isUsingArgument = true;
        var key = node.argument.ExecuteArgument(0, runtime)[0];
        // if (!key)
        //     throw new Error("Variable Key is required to get a value");
        // No need for this check
        if (!_super.prototype.isArgumentTypeof.call(this, key, "string"))
            throw new TypeError("Key of variable must be typeof string!");
        return runtime
            .components
            .Cache
            // .get(String(super.SafeWrapValue(key, { allowAsString: true }))); // Key value in array is all string
            .get(this.WrapAsString(key));
    };
    StandardLibrary.prototype.$export = function (runtime, node) {
        var _a, _b;
        node.isUsingArgument = true;
        var key = (((_b = (_a = node.argument) === null || _a === void 0 ? void 0 : _a.ExecuteAllArgument) === null || _b === void 0 ? void 0 : _b.call(_a, runtime)) || [])[0];
        if (!key)
            throw new Error("Variable Key is required to export a value");
        runtime.exports[String(_super.prototype.SafeWrapValue.call(this, key, { outputAsString: true }))] = runtime.components.registered_calls.get(String(_super.prototype.SafeWrapValue.call(this, key, { outputAsString: true })));
        return '';
    };
    StandardLibrary.prototype.$log = function (runtime, node) {
        var _this = this;
        var _a;
        if (!node.argument || !(node.argument.Size && ((_a = node.argument.getArgument(0)) === null || _a === void 0 ? void 0 : _a.length)))
            throw new Error("$log requires at least one argument of string");
        node.isUsingArgument = true;
        console.log.apply(console, node.argument.ExecuteAllArgument(runtime).map(function (x) { return _super.prototype.SafeWrapValue.call(_this, x, { outputAsString: true }); }));
        return '';
    };
    StandardLibrary.prototype.$warn = function (runtime, node) {
        var _a, _b;
        node.isUsingArgument = true;
        console.warn.apply(console, _super.prototype.SafeWrapValue.call(this, (_b = (_a = node.argument) === null || _a === void 0 ? void 0 : _a.ExecuteAllArgument) === null || _b === void 0 ? void 0 : _b.call(_a, runtime)));
        return '';
    };
    StandardLibrary.prototype.$error = function (runtime, node) {
        var _a, _b;
        node.isUsingArgument = true;
        console.error.apply(console, _super.prototype.SafeWrapValue.call(this, (_b = (_a = node.argument) === null || _a === void 0 ? void 0 : _a.ExecuteAllArgument) === null || _b === void 0 ? void 0 : _b.call(_a, runtime)));
        return '';
    };
    StandardLibrary.prototype.$time = function (runtime, node) {
        var _a;
        if (!node.argument || !(node.argument.Size && ((_a = node.argument.getArgument(0)) === null || _a === void 0 ? void 0 : _a.length)))
            throw new Error("$time requires one argument of string");
        var label = _super.prototype.SafeWrapValue.call(this, node.argument.ExecuteArgument(0, runtime), { outputAsString: true });
        if (typeof label !== "string")
            throw new TypeError("label must be typeof string!");
        node.isUsingArgument = true;
        console.time(label);
        return '';
    };
    StandardLibrary.prototype.$timeEnd = function (runtime, node) {
        var _a;
        if (!node.argument || !(node.argument.Size && ((_a = node.argument.getArgument(0)) === null || _a === void 0 ? void 0 : _a.length)))
            throw new Error("$time requires one argument of string");
        var label = _super.prototype.SafeWrapValue.call(this, node.argument.ExecuteArgument(0, runtime), { outputAsString: true });
        if (typeof label !== "string")
            throw new TypeError("label must be typeof string!");
        node.isUsingArgument = true;
        console.timeEnd(label);
        return '';
    };
    StandardLibrary.prototype.$count = function (runtime, node) {
        var _a;
        if (!node.argument || !(node.argument.Size && ((_a = node.argument.getArgument(0)) === null || _a === void 0 ? void 0 : _a.length)))
            throw new Error("$time requires one argument of string");
        var label = _super.prototype.SafeWrapValue.call(this, node.argument.ExecuteArgument(0, runtime), { outputAsString: true });
        if (typeof label !== "string")
            throw new TypeError("label must be typeof string!");
        node.isUsingArgument = true;
        console.count(label);
        return '';
    };
    StandardLibrary.prototype.$countReset = function (runtime, node) {
        var _a;
        if (!node.argument || !(node.argument.Size && ((_a = node.argument.getArgument(0)) === null || _a === void 0 ? void 0 : _a.length)))
            throw new Error("$time requires one argument of string");
        var label = _super.prototype.SafeWrapValue.call(this, node.argument.ExecuteArgument(0, runtime), { outputAsString: true });
        if (typeof label !== "string")
            throw new TypeError("label must be typeof string!");
        node.isUsingArgument = true;
        console.countReset(label);
        return '';
    };
    return StandardLibrary;
}(Component_1.Component));
exports.StandardLibrary = StandardLibrary;
