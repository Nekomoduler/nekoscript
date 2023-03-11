import { NekoRuntime } from "..";
import { Component, Version } from "../Component";
import { CallNode } from "../parser";
var SINGLETON_INSTANCE: LogModule;

declare interface LogOptions {
    debug?: boolean;
    logErrorObject?: boolean;
}

class LogModule extends Component {
    public intl = new Intl.DateTimeFormat();
    public constructor(public options?: LogOptions) {
        super("LogModule", "NekoModules", new Version(0, 0, 1), {
            onLoad: () => {
                this.Info(`NekoLog initialized on Version ${this.Version.toString()}`);
                this.Info(`Module created by ${this.Author}`);
            }
        });
    };

    static get Singleton() {
        if (!SINGLETON_INSTANCE) {
            SINGLETON_INSTANCE = new LogModule();

        }
        return SINGLETON_INSTANCE;
    }

    Debug(message: string) {
        if (this.options?.debug === true) 
            console.debug(this.formatMessage(message));
    };
    Info(message: string) {
        console.info(`\u001b[38;5;33m${this.formatMessage(message)}\u001b[0m`);
    };
    Warning(message: string) {
        console.warn(`\u001b[38;5;226m${this.formatMessage(message)}\u001b[0m`);
    };
    Error(message: Error | string) {
        console.error(`\u001b[38;5;196m${this.formatMessage(message)}\u001b[0m`);
    };

    public formatMessage(message: Error | string) {
        return `[${this.intl.format(new Date())}] ${message instanceof Error ? `${message}\n\t${message.stack}` : message}`
    }
}

export {
    LogModule
}