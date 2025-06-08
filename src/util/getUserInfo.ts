import { Database } from "./database";
import { log } from "./log";
import { user, userProperty } from './user';

export class getUser{

    private static async parse(results):Promise<user>{
        if (results[0].toString() == "") {
            log("Can not parse empty user", "error");
            return null;
        }

        var newUser = new user(
            results[0][0].name,
            results[0][0].email,
            results[0][0].id,
            JSON.parse(results[0][0].permissions).permissions,
            results[0][0].superuser
        );

        if(results[0][0].password){
            newUser.password = results[0][0].password
        }
        if(results[0][0].passwordResetCode) {
            newUser.passwordResetCode = results[0][0].passwordResetCode;
        }
        if(results[0][0].salt){
            newUser.salt = results[0][0].salt
        }
        return newUser;

    }

    static async by(identifyers:userProperty)//:Promise<user> 
    {
        var index = 0;
        var query = "SELECT * FROM users WHERE"

        if(identifyers.id){
            index++;

            query += " id=" +identifyers.id 

            if(index > 0){
                query += " AND"
            }
        }
        if(identifyers.username){
            index++;

            query += " name='" +identifyers.username+"'" ;

            if(index > 0){
                query += " AND"
            }
        }
        if(identifyers.password){
            index++;

            query += " password='" +identifyers.password +"'"

            if(index > 0){
                query += " AND"
            }
        }
        if(identifyers.email){
            index++;

            query += " email='" +identifyers.email +"'"

            if(index > 0){
                query += " AND"
            }
        }
        if(identifyers.permissions){
            index++;

            query += " permissions=" +identifyers.permissions

            if(index > 0){
                query += " AND"
            }
        }
        if(identifyers.salt){
            index++;

            query += " salt='" +identifyers.salt +"'"

            if(index > 0){
                query += " AND"
            }
        }
        if(identifyers.superuser){
            index++;

            query += " superuser=" +identifyers.superuser

            if(index > 0){
                query += " AND"
            }
        }
        if(identifyers.passwordResetCode){
            index++;
            
            query += " passwordResetCode='" +identifyers.passwordResetCode +"'" 

            if(index > 0){
                query += " AND"
            }
        }
        query = query.slice(0, query.length-4)

        const res = await Database.query(query)
        const User = await this.parse(res)

        return User;
    }
}