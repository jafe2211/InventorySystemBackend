import express from "express";

import { requestChecker } from "../util/requestChecker";
import { log, logEnd } from "../util/log";
import { DatabaseHandlerLogin } from "../util/databaseHandlerLogin";
import { user } from "../util/user";
import { getUser } from '../util/getUserInfo';

export const loginRouter = express.Router();

declare module "express-session" {
    interface SessionData {
        user: user;
    }
  }

loginRouter.post("/test", (req, res) =>{
    log("test recived");
    
    if(!req.session.user){
        log("User not Authenticated", "error");
        logEnd();
        res.sendStatus(401)
        return;
    }
    log("User Authenticated", "success");
    logEnd()
    res.header({
        'Access-Control-Allow-Credentials': true
    }).status(200).json({
        "message": req.session.user
    })
})

loginRouter.post("/login", async (req, res) => {
    log("Login request received");
    if(!requestChecker.checkForDataInBody(req, ["username", "password"]) == true){
        requestChecker.returnEmptyBodyResponse(res);
        log("request was empty or missing required Data!", "error");
        logEnd();
        return;
    }

    if(await DatabaseHandlerLogin.checkLogin(req.body.username, req.body.password) != true){
        res.status(401).json({
            message: "wrong username or password"
        });
        log("User name or Password given in the request where not found in data base", "error");
        logEnd();
        return;
    }

    req.session.user = await getUser.by({username: req.body.username});
    req.session.save();
    res.header({
        'Access-Control-Allow-Credentials': true
    }).sendStatus(200);

    log("Login request successful for user: " + req.session.user.username, "success");
    logEnd();
}); 

loginRouter.post("/logout", (req, res) => {
    log("Logout request received");
    const sessionUser = req.session.user;
    req.session.destroy((err) => {
        if (err) {
            log("Error while destroying session: " + err, "error");
            res.status(500).json({ message: "Internal server error" });
            return;
        } else {
            res.status(200).json({ message: "Logged out successfully" });
        }
    });

    log("Logout request successful for user: " + sessionUser.username);
    log("--------------------------------------------");
}); 