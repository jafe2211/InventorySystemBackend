import fs from 'fs';

import { log } from './log.js';

/*export interface config {
    settings: string[] = [
        "logToFile",
        "logToConsole",
        "logPath",
        "appPort",
        "dbHost",
        "dbUser",
        "dbPass",
        "dbBase",
        "mailUser",
        "mailPass"];
    Security: string[] = [
        "SECRET_KEY",
        "SECRET_IV",
        "encryptionMethod"];
}
*/


export class ConfigHandler {
    static config: any;

    static setup(): void {
        if (!fs.existsSync("./config.json")) {

            log("Config file not found, creating new one...", "warn");

            fs.writeFileSync("./config.json", JSON.stringify({
                settings: {
                    logToFile: false,
                    logToConsole: true,
                    logPath: "./Logs",
                    appPort: 3000,
                    dbHost: "",
                    dbUser: "",
                    dbPass: "",
                    dbBase: ""
                },

                Security: {
                    SECRET_KEY: "",
                    SECRET_IV: "",
                    encryptionMethod: "",
                },

    

            }, null, 2));
            //logM("Config file created");
        }

        this.config = JSON.parse(fs.readFileSync("./config.json", 'utf8'));

        log("Config file loaded", "info");
    }

    static reloadConfig(): void {
        if (!fs.existsSync("./config.json")) { this.setup(); return; }

        this.config = JSON.parse(fs.readFileSync("./config.json", 'utf8'));

        log("Config file reloaded", "info");
    }

    static saveConfig(): void {
        fs.writeFileSync("./config.json", JSON.stringify(this.config, null, 2));
    }
}