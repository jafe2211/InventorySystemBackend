import argon2 from "argon2";

import { Cryption } from "./cryption";
import { Database } from "./database";
import { log } from "./log";
import { user } from "./classes";

export class DatabaseHandlerLogin {

    static async createNewUser(username: string, password: string, email:string) {
        const salt = Cryption.generateSalt(32);
        const passwordToBeHashed = password + salt;
        const hashedPassword = await argon2.hash(passwordToBeHashed);

        const query = "INSERT INTO users (name, password, salt, email, permissions, superuser) VALUES ('" + username + "', '" + hashedPassword + "', '" + salt + "', '" + email + "', + '{}', 0)";

        try {
            await Database.query(query);
            log("User " + username + " created successfully");
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
    return true;
    }

    static async getUserInfo(username: string): Promise<user> {
        try {
            const query = "SELECT * FROM users WHERE name ='" + username + "'";
            const results = await Database.query(query);

            if (results[0].toString() != "") {
                var newUser = new user(
                    results[0][0].name,
                    results[0][0].email,
                    results[0][0].id,
                    results[0][0].permissions,
                    results[0][0].superuser
                );

                return newUser;
            } else {
                log("User " + username + " does not exist", "error");
                return null;
            }
        } catch (error) {
            log("Error getting user info: " + error, "error");
            return null;
        }
    }
    static async getUserInfoById(id: number): Promise<user> {
        try {
            const query = "SELECT * FROM users WHERE id =" + id ;
            const results = await Database.query(query);

            if (results[0].toString() != "") {
                var newUser = new user(
                    results[0][0].name,
                    results[0][0].email,
                    results[0][0].id,
                    JSON.parse(results[0][0].permissions).permissions,
                    results[0][0].superuser
                );

                log(JSON.parse(results[0][0].permissions).permissions);
                if(Array.isArray(newUser.permissions)) {
                    log("permission yes")
                }else {
                    log("permission no")
                }

                return newUser;
            } else {
                log("User id " + id + " does not exist", "error");
                return null;
            }
        } catch (error) {
            log("Error getting user info: " + error, "error");
            return null;
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
    }
}