import { Component, Version } from "../Component";
import type NekoRuntime from "../NekoRuntime";
import type { CallNode } from "../parser";

class StandardLibrary extends Component {
    public constructor() {
        super("StandardLibrary", "NekoScript", new Version(0, 0, 2));
    }

    public async $typeof(runtime: NekoRuntime, node: CallNode) {
        if (!node.argument || !(node.argument.Size && node.argument.getArgument(0)?.length)) 
            throw new Error("$typeof requires one argument of object!");

        node.isUsingArgument = true;
        const arg = await node.argument.ExecuteArgument(0, runtime);
        return typeof super.SafeWrapValue(arg, { outputAsString: true });
    }

    public async $len(runtime: NekoRuntime, node: CallNode) {
        if (!node.argument || !(node.argument.Size && node.argument.getArgument(0)?.length))
            throw new Error("$len requires one argument of (length/size)-like object");

        node.isUsingArgument = true;
        
        let arg = super.SafeWrapValue(await node.argument.ExecuteArgument(0, runtime));


        return (arg as any)?.size || arg?.length;
    }

    public async $set(runtime: NekoRuntime, node: CallNode) {
        if (!node.argument || !(node.argument.Size && node.argument.getArgument(0)?.length))
            throw new Error("$get requires one argument of string");
            
        node.isUsingArgument = true;
        const [key, value] = await node.argument.ExecuteAllArgument(runtime);
        // if (!key)
        //     throw new Error("Variable Key is required to get a value");
        // No need for this check

        if (!super.isArgumentTypeof(key, "string"))
            throw new TypeError("Key of variable must be typeof string!");

        runtime
            .components
            .cache
            // .get(String(super.SafeWrapValue(key, { allowAsString: true })), super.SafeWrapValue(value, { allowAsString: true })); // Improvise
            .set(this.WrapAsString(key), super.SafeWrapValue(value));

        return '';
    }

    public async $get(runtime: NekoRuntime, node: CallNode) {
        if (!node.argument || !(node.argument.Size && node.argument.getArgument(0)?.length))
            throw new Error("$get requires one argument of string");

        node.isUsingArgument = true;
        const [key] = await node.argument.ExecuteArgument(0, runtime);
        // if (!key)
        //     throw new Error("Variable Key is required to get a value");
        // No need for this check

        if (!super.isArgumentTypeof(key, "string"))
            throw new TypeError("Key of variable must be typeof string!");
        
        return runtime
        .components
        .cache
        // .get(String(super.SafeWrapValue(key, { allowAsString: true }))); // Key value in array is all string
        .get(this.WrapAsString(key));

    }

    public async $export(runtime: NekoRuntime, node: CallNode) {
        node.isUsingArgument = true;
        const [key] = await node.argument?.ExecuteAllArgument?.(runtime) || [];
        if (!key)
            throw new Error("Variable Key is required to export a value");

        runtime.exports[String(super.SafeWrapValue(key, { outputAsString: true }))] = runtime.components.registered_calls.get(String(super.SafeWrapValue(key, { outputAsString: true })));
        return '';
    }

    public async $log(runtime: NekoRuntime, node: CallNode) {
        if (!node.argument || !(node.argument.Size && node.argument.getArgument(0)?.length))
            throw new Error("$log requires at least one argument of string");

        node.isUsingArgument = true;
        console.dir(...(await node.argument.ExecuteAllArgument(runtime)).map(
            x => super.SafeWrapValue(x, { outputAsString: true })
        ));
        return '';
    }

    public async $warn(runtime: NekoRuntime, node: CallNode) {
        node.isUsingArgument = true;
        console.warn(...super.SafeWrapValue(await node.argument?.ExecuteAllArgument?.(runtime)));
        return '';
    }

    public async $error(runtime: NekoRuntime, node: CallNode) {
        node.isUsingArgument = true;
        console.error(...super.SafeWrapValue(await node.argument?.ExecuteAllArgument?.(runtime)));
        return '';
    }

    public async $time(runtime: NekoRuntime, node: CallNode) {
        if (!node.argument || !(node.argument.Size && node.argument.getArgument(0)?.length))
            throw new Error("$time requires one argument of string");

        const arg = await node.argument.ExecuteArgument(0, runtime);
        const label = super.SafeWrapValue(arg, { outputAsString: true });
        if (typeof label !== "string")
            throw new TypeError("label must be typeof string!");

        node.isUsingArgument = true;
        console.time(label);
        return '';
    }

    public async $timeEnd(runtime: NekoRuntime, node: CallNode) {
        if (!node.argument || !(node.argument.Size && node.argument.getArgument(0)?.length))
            throw new Error("$time requires one argument of string");

        const arg = await node.argument.ExecuteArgument(0, runtime);
        const label = super.SafeWrapValue(arg, { outputAsString: true });
        if (typeof label !== "string")
            throw new TypeError("label must be typeof string!");
            
        node.isUsingArgument = true;
        console.timeEnd(label);
        return '';
    }

    public async $count(runtime: NekoRuntime, node: CallNode) {
        if (!node.argument || !(node.argument.Size && node.argument.getArgument(0)?.length))
            throw new Error("$time requires one argument of string");

        const arg = await node.argument.ExecuteArgument(0, runtime);
        const label = super.SafeWrapValue(arg, { outputAsString: true });
        if (typeof label !== "string")
            throw new TypeError("label must be typeof string!");
            
        node.isUsingArgument = true;
        console.count(label);
        return '';
    }

    public async $countReset(runtime: NekoRuntime, node: CallNode) {
        if (!node.argument || !(node.argument.Size && node.argument.getArgument(0)?.length))
            throw new Error("$time requires one argument of string");

        const arg = await node.argument.ExecuteArgument(0, runtime);
        const label = super.SafeWrapValue(arg, { outputAsString: true });
        if (typeof label !== "string")
            throw new TypeError("label must be typeof string!");
            
        node.isUsingArgument = true;
        console.countReset(label);
        return '';
    }
}

export {
    StandardLibrary
}