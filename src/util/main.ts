import { promises } from "fs";
import { ConfigHandler } from "./configHandler";
import { Database } from "./database";
import { log } from "./log";

export class main{
    static async startup():Promise<boolean>{
        this.printASciiArt();
        log("made by: Jafe2211 & Avalyn09 ")

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

    private static printASciiArt():void {
        console.log(`
            
██╗███╗   ██╗██╗   ██╗███████╗███╗   ██╗████████╗ █████╗ ██████╗     ███████╗██╗   ██╗███████╗████████╗███████╗███╗   ███╗
██║████╗  ██║██║   ██║██╔════╝████╗  ██║╚══██╔══╝██╔══██╗██╔══██╗    ██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║
██║██╔██╗ ██║██║   ██║█████╗  ██╔██╗ ██║   ██║   ███████║██████╔╝    ███████╗ ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║
██║██║╚██╗██║╚██╗ ██╔╝██╔══╝  ██║╚██╗██║   ██║   ██╔══██║██╔══██╗    ╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║
██║██║ ╚████║ ╚████╔╝ ███████╗██║ ╚████║   ██║   ██║  ██║██║  ██║    ███████║   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║
╚═╝╚═╝  ╚═══╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝    ╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝
                                                                                                                          

        `);
    }
    
}