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

//define the config class
export class ConfigHandler {
    static config: any;

    /// Method to setup the config system. needs to be called before using the config system.
    static setup(): void {

        //checking if the config file exists
        if (!fs.existsSync("./config.json")) {

            log("Config file not found, creating new one...", "warn");

            //create the config file with default values
            fs.writeFileSync("./config.json", JSON.stringify({
                settings: {
                    logToFile: false,
                    logToConsole: true,
                    logPath: "./Logs",
                    appPort: 3000,
                    dbHost: "",
                    dbUser: "",
                    dbPass: "",
                    dbBase: "",
                    mail: {
                        mailHost: "",
                        mailPort: 465,
                        mailSecure: true,
                        mailUser: "",
                        mailPass: ""
                    }
                },

                Security: {
                    SECRET_KEY: "",
                    SECRET_IV: "",
                    encryptionMethod: "",
                },

    

            }, null, 2));
        }

        //reading the config file and parsing it into an object
        this.config = JSON.parse(fs.readFileSync("./config.json", 'utf8'));

        log("Config file loaded", "info");
    }

    // Method to reload the config file. needs to be called after changing the config file.
    static reloadConfig(): void {

        // checking if the config file exists if not, calling setup
        if (!fs.existsSync("./config.json")) { this.setup(); return; }

        // reading the config file and parsing it into an object
        this.config = JSON.parse(fs.readFileSync("./config.json", 'utf8'));

        log("Config file reloaded", "info");
    }

    // Method to save the config file.
    static saveConfig(): void {
        fs.writeFileSync("./config.json", JSON.stringify(this.config, null, 2));
    }
}