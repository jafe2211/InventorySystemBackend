import express from 'express';

import { log } from '../util/log';
import { requestChecker } from '../util/requestChecker';
import { DatabaseHandlerLogin } from '../util/databaseHandlerLogin';
import { user } from '../util/classes';

export const userManagementRouter = express.Router();
declare module "express-session" {
    interface SessionData {
        user: user;
    }
  }
  
userManagementRouter.post('/createUser', async (req, res) => {
    log("Register request received");
        if(!requestChecker.checkForDataInBody(req, ["username", "password", "email"]) == true){
            requestChecker.returnEmptyBodyResponse(res);
            return;
        }
    
        if(await DatabaseHandlerLogin.checkIfUserExsists(req.body.username) == true){
            res.status(400).json({
                message: "Username already exists"
            });
            return;
        }
    
        DatabaseHandlerLogin.createNewUser(req.body.username, req.body.password, req.body.email);
});