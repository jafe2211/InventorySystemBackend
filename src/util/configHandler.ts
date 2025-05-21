import fs from 'fs';
import { log } from './log.js';

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
                    dbHost: "localhost",
                    dbUser: "Dashboard",
                    dbPass: "6mtHD65zc2URAPJDzMeG",
                    dbBase: "Dashboard"
                },

                Security: {
                    SECRET_KEY: "P,}g29{zhzv1ySvS]lf4NyteHU1ouA0U98g7A]vw2E(}72EIVg/uXN6psP5xNiy7RD[abcs,&[0nN.nO,VbzD0y641r8coIhvY7y",
                    SECRET_IV: "AgOv]gJS/mlIJZh8U1mmn4ntz,2HHymy]rmQrNkz.nlrIhuzfEslwJ.(qgd7Qp5Qr0d5EWADajkyva(wHM.Ua9U((J4Q9BeMgAH{",
                    encryptionMethod: "aes-256-cbc",
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