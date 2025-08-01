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
            port: ConfigHandler.config.settings.database.dbPort
        });
    }

    static async query(sql:string){
        try{
            const [rows] = await pool.promise().query(sql);
            return [rows];
        } catch (error) {
            log("Database query error: " + error, "error");

        }
    }

    static async checkConnection(){
        var connenction = pool.promise().getConnection();
        return connenction;
    } 

    static async checkForTable(TableName:string, DatabaseName:string){
       return await this.query(`SELECT count(*)
                    FROM information_schema.tables
                    WHERE table_schema = '${DatabaseName}'
                    AND table_name = '${TableName}'`)
    }

    static async setup(){
        if (!pool) {
            log("Creating database connection pool...", "info");
            await this.createPool();
            log("Database connection pool created successfully.", "info");
        } else {
            log("Database connection pool already exists.", "error");
        }

        try {
            await this.checkConnection();
            log("Database connection is healthy.", "info");
        } catch (error) {
            log("Database connection failed: " + error, "error");
        }

    }
}