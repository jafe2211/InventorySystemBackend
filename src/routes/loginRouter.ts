import express from "express";

import { requestChecker } from "../util/requestChecker";
import { log } from "../util/log";
import { DatabaseHandlerLogin } from "../util/databaseHandlerLogin";
import { user } from "../util/classes";

export const loginRouter = express.Router();

declare module "express-session" {
    interface SessionData {
        user: user;
    }
  }

loginRouter.post("/login", async (req, res) => {
    log("Login request received");
    if(!requestChecker.checkForDataInBody(req, ["username", "password"]) == true){
        requestChecker.returnEmptyBodyResponse(res);
        return;
    }

    if(await DatabaseHandlerLogin.checkLogin(req.body.username, req.body.password) != true){
        res.status(401).json({
            message: "wrong username or password"
        });
        return;
    }

    req.session.user = await DatabaseHandlerLogin.getUserInfo(req.body.username);
    req.session.save();
    res.status(200);
}); 

loginRouter.post("/logout", (req, res) => {
    log("Logout request received");
    req.session.destroy((err) => {
        if (err) {
            log("Error while destroying session: " + err, "error");
            res.status(500).json({ message: "Internal server error" });
        } else {
            res.status(200).json({ message: "Logged out successfully" });
        }
    });
}); 