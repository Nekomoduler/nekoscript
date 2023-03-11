import * as tokenizer from "./tokenize";
import * as parser from './parser';
import * as ComponentModule from './Component';
import * as NativeComponents from './components';
import NekoRuntime from './NekoRuntime';
import { TokenGrammar } from "./tokenize";

const NekoLog = NativeComponents.LogModule.Singleton;

export {
    tokenizer,
    parser,
    ComponentModule,
    NativeComponents,
    NekoRuntime,
    NekoLog,
    TokenGrammar
}