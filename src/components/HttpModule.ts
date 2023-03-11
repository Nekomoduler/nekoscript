import { NekoRuntime } from "..";
import { Component, Version } from "../Component";
import { CallNode } from "../parser";

class HttpModule extends Component {
    public constructor() {
        super("HttpModule", "NodeModules", new Version(0, 0, 1));
    }

    async $setUrl(runtime: NekoRuntime, node: CallNode) {
        if (! (node.argument && node.argument?.Size > 0))
            throw new Error("$setUrl requires atleast one argument!");

        const args = await node.argument.ExecuteArgument(0, runtime);

        runtime.components.Cache.set("httpurl", super.WrapAsString(args));
    }

    async $encodeURI(runtime: NekoRuntime, node: CallNode) {
        if (! (node.argument && node.argument?.Size > 0))
            throw new Error("$encodeURI requires atleast one argument!");

        const args = await node.argument.ExecuteArgument(0, runtime);

        return encodeURI(super.WrapAsString(args));
    }

    async $setHeader(runtime: NekoRuntime, node: CallNode) {
        if (! (node.argument && node.argument?.Size > 1))
            throw new Error("$setHeader requires atleast more than one argument!");

        const [key, value] = (await node.argument.ExecuteAllArgument(runtime)).map(x => super.WrapAsString(x));

        
    }
}