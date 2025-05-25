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
    log("createNewUser request received");
        if(!requestChecker.checkForDataInBody(req, ["username", "password", "email"]) == true){
            requestChecker.returnEmptyBodyResponse(res);
            return;
        }
    
        if(await DatabaseHandlerLogin.checkIfUserExsists(req.body.username) == true){
            requestChecker.returnCustomResponse(res, 400, "Username already exists");
            return;
        }
    
        DatabaseHandlerLogin.createNewUser(req.body.username, req.body.password, req.body.email);
        requestChecker.returnCustomResponse(res, 200, "User created successfully");
        
    log("createNewUser request successful for user: " + req.body.username);
    log("--------------------------------------------");
});

userManagementRouter.post('/addPermissions', async (req, res) => {
    if(!requestChecker.checkForDataInBody(req, ["id", "permissions"]) == true){
        requestChecker.returnEmptyBodyResponse(res);
        return;
    }

    if(req.session.user == undefined || req.session.user == null) {
        requestChecker.returnCustomResponse(res, 401, "You are not logged in");
        return;
    }
    const RequestUser = await DatabaseHandlerLogin.getUserInfo(req.session.user.username);

    if(!RequestUser.checkPermission("updateUserPermissions")){
        requestChecker.returnCustomResponse(res, 403, "You do not have permission to update user permissions");
        return;
    }

    try {
        const userToUpdate = await DatabaseHandlerLogin.getUserInfoById(req.body.id);

        if(userToUpdate == null) {
            requestChecker.returnCustomResponse(res, 404, "User not found");
            return;
        }

        userToUpdate.addPermissions(req.body.permissions);

        await DatabaseHandlerLogin.updateUserInfo(userToUpdate);

        requestChecker.returnCustomResponse(res, 200, "Permissions added successfully");
    } catch (error) {
        log("Error adding permissions: " + error, "error");
        requestChecker.returnCustomResponse(res, 500, "Internal server error");
        return;
    }
});

userManagementRouter.post('/updatePermissions', async (req, res) => {
    if(!requestChecker.checkForDataInBody(req, ["id", "permissions"]) == true){
        requestChecker.returnEmptyBodyResponse(res);
        return;
    }

    if(req.session.user == undefined || req.session.user == null) {
        requestChecker.returnCustomResponse(res, 401, "You are not logged in");
        return;
    }
    const RequestUser = await DatabaseHandlerLogin.getUserInfo(req.session.user.username);

    if(!RequestUser.checkPermission("updateUserPermissions")){
        requestChecker.returnCustomResponse(res, 403, "You do not have permission to update user permissions");
        return;
    }

    try {
        const userToUpdate = await DatabaseHandlerLogin.getUserInfoById(req.body.id);

        if(userToUpdate == null) {
            requestChecker.returnCustomResponse(res, 404, "User not found");
            return;
        }

        userToUpdate.replacePermissions(req.body.permissions);

        await DatabaseHandlerLogin.updateUserInfo(userToUpdate);

        requestChecker.returnCustomResponse(res, 200, "Permissions added successfully");
    } catch (error) {
        log("Error updating permissions: " + error, "error");
        requestChecker.returnCustomResponse(res, 500, "Internal server error");
        return;
    }
});