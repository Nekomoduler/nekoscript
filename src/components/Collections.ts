import { NekoRuntime } from "..";
import { Component, Version } from "../Component";
import { CallNode } from "../parser";

class Collections extends Component {
    constructor() {
        super("CollectionsLibrary", "NekoModules", new Version(0, 0, 1));
    }

    public $newlist() {
        return [];
    }
    public $newset() {
        return new Set();
    }
    public $newmap() {
        return new Map();
    }

    public async $setitem(runtime: NekoRuntime, node: CallNode) {
        if (! (node.argument && node.argument.Size > 1)) {
            throw new Error("$setitem requires more than one argument")
        }

        const [base, key, value] = (await node.argument.ExecuteAllArgument(runtime)).map(x => this.SafeWrapValue(x));

        if (Array.isArray(base)) {
            return base.push(key);
        }
        
        if (base instanceof Set) {
            return base.add(key);
        }

        if (base instanceof Map) {
            return base.set(key, value);
        }

        throw new Error("unable to handle given arguments");
    }

    public async $removeitem(runtime: NekoRuntime, node: CallNode) {
        if (! (node.argument && node.argument.Size > 1)) {
            throw new Error("$removeitem requires more than one argument")
        }

        const [base, key] = (await node.argument.ExecuteAllArgument(runtime)).map(x => this.SafeWrapValue(x));

        if (Array.isArray(base)) {
            return base.filter(x => x !== key);
        }
        
        if (base instanceof Set) {
            return base.delete(key);
        }

        if (base instanceof Map) {
            return base.delete(key);
        }

        throw new Error("unable to handle given arguments");
    }

    public async $includesitem(runtime: NekoRuntime, node: CallNode) {
        if (! (node.argument && node.argument.Size > 1)) {
            throw new Error("$removeitem requires more than one argument")
        }

        const [base, key] = (await node.argument.ExecuteAllArgument(runtime)).map(x => this.SafeWrapValue(x));

        if (Array.isArray(base)) {
            return base.includes(key);
        }
        
        if (base instanceof Set) {
            return base.has(key);
        }

        if (base instanceof Map) {
            return base.has(key);
        }

        return false;
    }
}

export {
    Collections
}