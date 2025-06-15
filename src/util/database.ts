import mysql2 from "mysql2";

import { ConfigHandler } from './configHandler';
import { log } from "./log";

ConfigHandler.setup();

var pool: mysql2.Pool;

export class Database {

    static async createPool(){
        pool = mysql2.createPool({
            host: ConfigHandler.config.settings.database.dbHost,
            user: ConfigHandler.config.settings.database.dbUser,
            password: ConfigHandler.config.settings.database.dbPassword,
            database: ConfigHandler.config.settings.database.dbDatabase,
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