import mysql2 from "mysql2";

import { ConfigHandler } from './configHandler';
import { log } from "./log";

ConfigHandler.setup();

var pool: mysql2.Pool;

export class Database {

    static async createPool(){
        pool = mysql2.createPool({
            host: ConfigHandler.config.settings.dbHost,
            user: ConfigHandler.config.settings.dbUser,
            password: ConfigHandler.config.settings.dbPass,
            database: ConfigHandler.config.settings.dbBase,
        });
    }

    static async query(sql:string){
        const [rows] = await pool.promise().query(sql);
        return [rows];
    }

    static async checkConnection(){
        var connenction = pool.promise().getConnection();
        return connenction;
    }
}