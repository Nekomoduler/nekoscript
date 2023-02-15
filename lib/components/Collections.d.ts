import { NekoRuntime } from "..";
import { Component } from "../Component";
import { CallNode } from "../parser";
declare class Collections extends Component {
    constructor();
    $newlist(): any[];
    $newset(): Set<unknown>;
    $newmap(): Map<any, any>;
    $setitem(runtime: NekoRuntime, node: CallNode): Promise<number | Map<any, any> | Set<any>>;
    $removeitem(runtime: NekoRuntime, node: CallNode): Promise<boolean | any[]>;
    $includesitem(runtime: NekoRuntime, node: CallNode): Promise<boolean>;
}
export { Collections };
