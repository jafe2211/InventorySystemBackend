import fs from "fs";
import { ConfigHandler } from "./util/configHandler";
import { log } from "./util/log";

export class main {
    static async init(): Promise<boolean>{
        this.printASciiArt();
        this.loadModules();
        return true;
    }

    static loadModules(): void{
        for (const moduleName in ConfigHandler.config.settings.modules) {
            const moduleConfig = ConfigHandler.config.settings.modules[moduleName];
            if (moduleConfig.enabled) {
                try {
                    const modulePath = `./Modules/${moduleName}/index.js`;
                    if (fs.existsSync(modulePath)) {
                        import(modulePath)
                            .then(module => {
                                if (module.default && typeof module.default.init === 'function') {
                                    module.default.init();
                                }
                            })
                            .catch(err => log(`Failed to load module ${moduleName}: ${err}`, "error"));
                    } else {
                        log(`Module ${moduleName} does not exist at path: ${modulePath}`, "warn");
                    }
                } catch (error) {
                    log(`Error loading module ${moduleName}: ${error}`, "error");
                }
            }
        }
    }

    private static printASciiArt(): void {
        var asciiArt: string;
        try {
            asciiArt = fs.readFileSync("src/Modules/ModuleLib/util/asciiArt.txt", 'utf8');
        } catch (error) {
            asciiArt = ConfigHandler.config.settings.app.appName || "";
        }
        console.log(asciiArt);
        log("made by: " + ConfigHandler.config.settings.app.appAuther || "Unknown");
    }
}