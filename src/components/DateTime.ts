import { NekoRuntime } from "..";
import { Component, Version } from "../Component";
import { CallNode } from "../parser";

class DateTime extends Component {
    constructor() {
        super("DateTime", "NekoModules", new Version(0, 0, 1));
    }

    public $datenow() {
        return Date.now();
    }
}

export {
    DateTime
}