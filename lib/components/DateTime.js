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
exports.DateTime = void 0;
var Component_1 = require("../Component");
var DateTime = /** @class */ (function (_super) {
    __extends(DateTime, _super);
    function DateTime() {
        return _super.call(this, "DateTime", "NekoModules", new Component_1.Version(0, 0, 1)) || this;
    }
    DateTime.prototype.$datenow = function () {
        return Date.now();
    };
    return DateTime;
}(Component_1.Component));
exports.DateTime = DateTime;
