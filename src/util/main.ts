import { promises } from "fs";
import { ConfigHandler } from "./configHandler";
import { Database } from "./database";
import { log } from "./log";

export class main{
    static async startup():Promise<boolean>{
        ConfigHandler.setup();

        log("Starting Server...", "info")
        
        await this.checkDatabase()
        return true;

    }

    private static async checkDatabase():Promise<boolean>{
        try{
            await Database.createPool();
            log("Connecting to Database...", "info")

            await Database.checkConnection();

            log("Database connection successful", "info");
         } catch (error) {
            log("Database connection failed: " + error, "error");
            log("Trying again in: 20 sec", "error");
            
            setTimeout(() => {
                return false;
            }, 20 * 1000);
         }
        return true;
    }
}