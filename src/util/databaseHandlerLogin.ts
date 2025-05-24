import { Database } from "./database";
import { log } from "./log";

export class DatabaseHandlerLogin {
    static async createNewUser(username: string, password: string) {
        
    }
    static async checkIfUserExsists(username: string):Promise<boolean> {
        try {
            const query = "SELECT name FROM users WHERE name ='" + username + "'";
            const results = await Database.query(query);

            if(results.toString() != "") {
                log("Username " + username + " already exists", "error");
                return true;
            }
            return false;
       } catch (error) {
            log("Error checking if user exists: " + error, "error");
            return false;
        }
    return true;
    }
}