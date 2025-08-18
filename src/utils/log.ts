import clc from "cli-color"
import fs from "fs"

import { Config } from "./config"

const time = new Date()

export enum LogLevel {
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    DEBUG = "debug",
    SUCCESS = "SUCCESS",
    STANDARD = "standard",
}

export function log(message: string, level?: LogLevel): void {
    const timestamp = new Date().toLocaleString("de-DE")
    const logMessage = `[${timestamp}] [${level || ""}] ${message}`

    if(Config.config.settings.log.LOG_TO_CONSOLE) {
        switch (level) {
            case LogLevel.INFO:
                console.log(clc.blue(logMessage))
                break;
            case LogLevel.WARN:
                console.warn(clc.yellow(logMessage))
                break;
            case LogLevel.ERROR:
                console.log(clc.red(logMessage))
                break;
            case LogLevel.DEBUG:
                console.log(clc.magenta(logMessage))
                break;
            case LogLevel.SUCCESS:
                console.log(clc.green(logMessage))
                break;
            default:
                console.log(clc.white(`[${timestamp}] ${message}`))
                break;
        }
    }

    if(Config.config.settings.log.LOG_TO_FILE) {
        const logPath = Config.config.settings.log.LOG_PATH;

        if (!fs.existsSync(logPath)) {
            fs.mkdirSync(logPath);
        }

        fs.appendFile(`${logPath}/${time.toLocaleDateString("de-DE")}.log`, logMessage + "\n", (err) =>{
            if(err) {
                log("Error while writing to log file:" + err.message, LogLevel.ERROR)
            }
        })

    }
}