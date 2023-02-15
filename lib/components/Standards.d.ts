import { Component } from "../Component";
import type NekoRuntime from "../NekoRuntime";
import type { CallNode } from "../parser";
declare class StandardLibrary extends Component {
    constructor();
    $typeof(runtime: NekoRuntime, node: CallNode): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
    $len(runtime: NekoRuntime, node: CallNode): any;
    $set(runtime: NekoRuntime, node: CallNode): string;
    $get(runtime: NekoRuntime, node: CallNode): any;
    $export(runtime: NekoRuntime, node: CallNode): string;
    $log(runtime: NekoRuntime, node: CallNode): string;
    $warn(runtime: NekoRuntime, node: CallNode): string;
    $error(runtime: NekoRuntime, node: CallNode): string;
    $time(runtime: NekoRuntime, node: CallNode): string;
    $timeEnd(runtime: NekoRuntime, node: CallNode): string;
    $count(runtime: NekoRuntime, node: CallNode): string;
    $countReset(runtime: NekoRuntime, node: CallNode): string;
}
export { StandardLibrary };
