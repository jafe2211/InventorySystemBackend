import fs from "fs";
import { ConfigHandler } from "./util/configHandler";

export class main {
    static async startup(): Promise<boolean>{
        this.printASciiArt();
        return true;
    }

    static loadModules(): void{
        
    }

    private static printASciiArt(): void {
        var asciiArt: string;
        /*try {
            asciiArt = fs.readFileSync("./util/asciiArt.txt", 'utf8');
        } catch (error) {
            asciiArt = "test";
        }*/
       asciiArt = "Test";
        console.log(asciiArt);
    }
}