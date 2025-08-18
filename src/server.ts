import fs from "fs";

import app, { loadModules } from "./app";
import { Config } from "./utils/config";
import { log, LogLevel } from "./utils/log";

export class Main {

    static async start() {
        Config.setup();
    
        this.printAsciiArt();
        log(`${Config.config.settings.app.NAME} Version: ${Config.config.settings.app.VERSION} made by ${Config.config.settings.app.AUTHOR}`)
        log("powered by Modul Lib")
        log("Starting Server...", LogLevel.INFO);
        await loadModules();

        app.listen(Config.config.settings.app.PORT, ()=>{
            log("Server running on Port " + Config.config.settings.app.PORT, LogLevel.SUCCESS)
        })
    
        }
    
    static stop() {
        process.exit(0);
    }

    static printAsciiArt() {
        var asciiArt;

        try {
            asciiArt = fs.readFileSync("./asciiArt.txt", "utf-8").toString();
        } catch (error) {
            log("Error reading ASCII art file:" + error, LogLevel.ERROR)
        }

        console.log(asciiArt || "");
    }

}

Main.start();