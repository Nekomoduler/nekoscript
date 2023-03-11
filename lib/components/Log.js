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
exports.LogModule = void 0;
var Component_1 = require("../Component");
var SINGLETON_INSTANCE;
var LogModule = /** @class */ (function (_super) {
    __extends(LogModule, _super);
    function LogModule(options) {
        var _this = _super.call(this, "LogModule", "NekoModules", new Component_1.Version(0, 0, 1), {
            onLoad: function () {
                _this.Info("NekoLog initialized on Version ".concat(_this.Version.toString()));
                _this.Info("Module created by ".concat(_this.Author));
            }
        }) || this;
        _this.options = options;
        _this.intl = new Intl.DateTimeFormat();
        return _this;
    }
    ;
    Object.defineProperty(LogModule, "Singleton", {
        get: function () {
            if (!SINGLETON_INSTANCE) {
                SINGLETON_INSTANCE = new LogModule();
            }
            return SINGLETON_INSTANCE;
        },
        enumerable: false,
        configurable: true
    });
    LogModule.prototype.Debug = function (message) {
        var _a;
        if (((_a = this.options) === null || _a === void 0 ? void 0 : _a.debug) === true)
            console.debug(this.formatMessage(message));
    };
    ;
    LogModule.prototype.Info = function (message) {
        console.info("\u001B[38;5;33m".concat(this.formatMessage(message), "\u001B[0m"));
    };
    ;
    LogModule.prototype.Warning = function (message) {
        console.warn("\u001B[38;5;226m".concat(this.formatMessage(message), "\u001B[0m"));
    };
    ;
    LogModule.prototype.Error = function (message) {
        console.error("\u001B[38;5;196m".concat(this.formatMessage(message), "\u001B[0m"));
    };
    ;
    LogModule.prototype.formatMessage = function (message) {
        return "[".concat(this.intl.format(new Date()), "] ").concat(message instanceof Error ? "".concat(message, "\n\t").concat(message.stack) : message);
    };
    return LogModule;
}(Component_1.Component));
exports.LogModule = LogModule;
