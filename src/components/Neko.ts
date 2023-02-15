import { Component, Version } from "../Component";

class NekoComponent extends Component {
    public constructor() {
        super("NekoComponent", "NekoModules", new Version(1, 0, 0))
    }
    public $isNeko = true;
    public $author = "NekoModules";
}

export {
    NekoComponent
}