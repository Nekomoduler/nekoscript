import { Component } from "../Component";
declare interface LogOptions {
    debug?: boolean;
    logErrorObject?: boolean;
}
declare class LogModule extends Component {
    options?: LogOptions;
    intl: Intl.DateTimeFormat;
    constructor(options?: LogOptions);
    static get Singleton(): LogModule;
    Debug(message: string): void;
    Info(message: string): void;
    Warning(message: string): void;
    Error(message: Error | string): void;
    formatMessage(message: Error | string): string;
}
export { LogModule };
