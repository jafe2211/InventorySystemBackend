import express from "express";
import fs from "fs";

import { log, LogLevel } from "./utils/log";
import { Config } from "./utils/config";

const app = express();

app.use(express.json())

export async function loadModules() {
    log("Loading Modules...", LogLevel.INFO)

    for (const moduleName in Config.config.settings.Modules) {
        const moduleConfig = Config.config.settings.Modules[moduleName];
        if (!moduleConfig.ENABLED) {
            log("Skiping " + moduleName + ", because it is disabled", LogLevel.INFO)

            continue;
         }

        try {
            const modulePath = `modules/${moduleName}/index.js`;
                if (!fs.existsSync("./dist/" + modulePath)) {
                    log(`Module ${moduleName} does not exist at path: ${modulePath}`, LogLevel.WARN);
                    log("Skiping it...", LogLevel.INFO);

                    continue;
                }
                await import("./" + modulePath)
                    .then(async module => {
                        if (module.default && typeof module.default.init === 'function') {
                            app.use(await module.default.init());
                        }
                    })
                    .catch(err => log(`Failed to load module ${moduleName}: ${err}`, LogLevel.ERROR));   
                    
            } catch (error) {
                log(`Error loading module ${moduleName}: ${error}`, LogLevel.ERROR);
            }
        }
    log("done", LogLevel.SUCCESS)
}



export default app;