import * as fs from 'fs';
import app from '../app';

interface configOptions {
    settings: {
        app:{
            PORT: number;
            NAME: string;
            VERSION: string;
            AUTHOR: string;
        },
        log: {
            LOG_TO_FILE: boolean;
            LOG_TO_CONSOLE: boolean;
            LOG_PATH: string;
        },
        security: {
            SECRET_KEY: string;
        },
        Modules: {
            [key: string]: {
                ENABLED: boolean;
                VERSION: string;
                settings: {
                    [key: string]: any;
                }
            };
        }
    }
}

export class Config {
    static config: configOptions;
    
    public static setup(): void {
        if(!fs.existsSync('./config.json')) {
            fs.writeFileSync('./config.json', JSON.stringify({
                settings: {
                    app: {
                        PORT: 3000,
                        NAME: "MyApp",
                        VERSION: "1.0.0",
                        AUTHOR: "Author Name"
                    },
                    log: {
                        LOG_TO_FILE: false,
                        LOG_TO_CONSOLE: true,
                        LOG_PATH: "./Logs"
                    },
                    security: {
                        SECRET_KEY: "your-secret-key"
                    },
                    Modules: {
                    
                    }
                }
            }, null, 2));

            this.config = JSON.parse(fs.readFileSync("./config.json", 'utf8'));
            return;
        }
        this.config = JSON.parse(fs.readFileSync("./config.json", 'utf8'));
        

    }
}

Config.setup();