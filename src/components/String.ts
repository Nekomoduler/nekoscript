import { Component, Version } from "../Component";
import type NekoRuntime from "../NekoRuntime";
import type { CallNode } from "../parser";

class StringLibrary extends Component {
    public constructor() {
        super("StringLibrary", "NekoScript", new Version(1, 0, 0));
    }
}

export {
    StringLibrary
}