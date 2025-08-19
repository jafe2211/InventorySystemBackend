import fs from "fs";

import app from "./app.js";
import { Config } from "./utils/config.js";
import { log, LogLevel } from "./utils/log.js";

export class Main {

    static async start() {
        this.printAsciiArt();
        log(`${Config.config.settings.app.NAME} Version: ${Config.config.settings.app.VERSION} made by ${Config.config.settings.app.AUTHOR}`)
        log("powered by Modul Lib")
        log("Starting Server...", LogLevel.INFO);    
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

//Main.start();

app.get("/t", (req, res) =>{

})

console.log("About to start server on port" + Config.config.settings.app.PORT);

app.listen(Config.config.settings.app.PORT, async ()=>{
    console.log("Server running on Port " + Config.config.settings.app.PORT, LogLevel.SUCCESS)
})

console.log("About to start server on port" + Config.config.settings.app.PORT);