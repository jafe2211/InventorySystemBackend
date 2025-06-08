import argon2 from "argon2";

import { Cryption } from "./cryption";
import { Database } from "./database";
import { log } from "./log";
import { user } from "./user";

export class DatabaseHandlerLogin {

    static async createNewUser(username: string, email:string) {
        //const salt = Cryption.generateSalt(32);
        //const passwordToBeHashed = password + salt;
        //const hashedPassword = await argon2.hash(passwordToBeHashed);
        const passwordResetCode = Cryption.generateResetCode(8);

        const query = "INSERT INTO users (name, email, permissions, superuser, passwordResetCode) VALUES ('" + username + "', '" + email + "', + '{}', 0, '" + passwordResetCode + "')";

        const User = new user(
            username,
            email,
            0,
            [],
            false
        );

        User.passwordResetCode = passwordResetCode;

        try {
            await Database.query(query);
            log("User " + username + " created successfully");
            return User;
        } catch (error) {
            log("Error creating user: " + error, "error");
        }
    }

    static async checkLogin(username: string, password: string): Promise<boolean> {
        try {
            const query = "SELECT password, salt, id FROM users WHERE name ='" + username + "'";
            const results = await Database.query(query);

            if (results[0].toString() == "") {
                log("User " + username + " does not exist", "error");
                return false;
            }

            const user = results[0][0];
            const passwordToBeHashed = password + user.salt;
            const isPasswordValid = await argon2.verify(user.password, passwordToBeHashed);

            if (isPasswordValid) {
                return true;
            } else {
                log("Invalid password for user: " + username, "error");
                return false;
            }
        } catch (error) {
            log("Error checking login: " + error, "error");
            return false;
        }
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
    }
    
    static async updateUserInfo(userToUpdate: user) {
        const permissions = JSON.stringify({
            "permissions": userToUpdate.permissions
        });

        const query = "UPDATE users SET name='" + userToUpdate.username + "', email= '" + userToUpdate.email + "', permissions= + '" + permissions + "', superuser= " + userToUpdate.superuser +" WHERE id = " + userToUpdate.id;

        try {
            await Database.query(query);
            log("User " + userToUpdate.username + " updated successfully");
        } catch (error) {
            log("Error creating user: " + error, "error");
        }
        log("--------------------------------------------");
    }

    static async updateFullUserInfo(userToUpdate: user): Promise<boolean> {
        log("Updating user: " + userToUpdate.username);

        const permissions = JSON.stringify({
            "permissions": userToUpdate.permissions
        });

        var query = "UPDATE users SET name='" + userToUpdate.username + 
        "', email= '" + userToUpdate.email +
        "', permissions= + '" + permissions + 
        "', superuser= " + userToUpdate.superuser + 
        ", passwordResetCode = '" + userToUpdate.passwordResetCode + 
        "'";

        const queryEnd = " WHERE id = " + userToUpdate.id;

        if(userToUpdate.password != undefined) {
            query += ", password = '" + userToUpdate.password + "'";
        }

        if(userToUpdate.salt != undefined) {
            query += ", salt = '" + userToUpdate.salt + "'";
        }

        query += queryEnd;

        try {
            await Database.query(query);
            log("User " + userToUpdate.username + " updated successfully", "success");
            return true;
        } catch (error) {
            log("Error updating user: " + error, "error");
            return false;
        }
    }

    static async deleteUser(userToDelete: user) {
        log("Deleting user: " + userToDelete.username);

        const query = "DELETE FROM users WHERE id = " + userToDelete.id;

        try {
            await Database.query(query);
            log("User " + userToDelete.username + " deleted successfully", "success");
        } catch (error) {
            log("Error deleting user: " + error, "error");
        }
    }
}