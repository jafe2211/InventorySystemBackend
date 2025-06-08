import express from 'express';

import { log, logEnd } from '../util/log';
import { requestChecker } from '../util/requestChecker';
import { DatabaseHandlerLogin } from '../util/databaseHandlerLogin';
import { user } from '../util/user';
import { MailHandler } from '../util/mailHandler';
import { EmailTemplates } from '../Email Templates/EmailTemplates';
import { getUser } from '../util/getUserInfo';

export const userManagementRouter = express.Router();
declare module "express-session" {
    interface SessionData {
        user: user;
    }
  }

userManagementRouter.post('/createUser', async (req, res) => {
    log("createNewUser request received");
        if(!requestChecker.checkForDataInBody(req, ["username", "email"]) == true){
            requestChecker.returnEmptyBodyResponse(res);
            return;
        }
    
        if(await DatabaseHandlerLogin.checkIfUserExsists(req.body.username) == true){
            requestChecker.returnCustomResponse(res, 400, "Username already exists");
            return;
        }
    
        const user =  await DatabaseHandlerLogin.createNewUser(req.body.username, req.body.email);

        if(user == null) {
            requestChecker.returnCustomResponse(res, 500, "Internal server error");
            return;
        }

        await MailHandler.sendHtmlMail(user.email, "Welcome to the System", EmailTemplates.getAccountCreatedTemplate(user.username, user.passwordResetCode));
        requestChecker.returnCustomResponse(res, 200, "User created successfully");
        
    log("createNewUser request successful for user: " + req.body.username);
    log("--------------------------------------------");
});

userManagementRouter.post('/changePassword/:passwordResetCode', async (req, res) => {
    log("changePassword request received");
    if(!requestChecker.checkForParameter(req, "passwordResetCode") == true){
        requestChecker.returnEmptyParametersResponse(res);
        return;
    }

    if(!requestChecker.checkForDataInBody(req, ["newPassword"]) == true){
        requestChecker.returnEmptyBodyResponse(res);
        return;
    }

    const userToUpdate = await getUser.by({passwordResetCode: req.params.passwordResetCode});

    if(userToUpdate == null) {
        requestChecker.returnCustomResponse(res, 404, "Not valid password reset code");
        return;
    }

    await userToUpdate.setPassword(req.body.newPassword);
    userToUpdate.passwordResetCode = ""; // Clear the password reset code after use

    await DatabaseHandlerLogin.updateFullUserInfo(userToUpdate);

});

userManagementRouter.post("/resetPassword", async (req, res) =>{
    log("resetPassword request recived!")

    if(!requestChecker.checkForDataInBody(req, ["email"]) == true){
        requestChecker.returnEmptyBodyResponse(res);
        log("Request Body was empty", "error")
        logEnd();
    }

    var user = await getUser.by({email: req.body.email})

    if(user == null) {
        return requestChecker.returnCustomResponse(res, 404, "No user found with the specified email")
    }

    user.resetPassword();
    if(!DatabaseHandlerLogin.updateFullUserInfo(user)) return requestChecker.returnCustomResponse(res, 500, "There was an internal server error");
    requestChecker.returnCustomResponse(res, 200, "Send password reset code to user")
})

userManagementRouter.delete('/deleteNewUser/:passwordResetCode', async (req, res) => {
    log("deleteUser request received");
    if(!requestChecker.checkForParameter(req, "passwordResetCode") == true){
        requestChecker.returnEmptyParametersResponse(res);
        return;
    }

    const userToDelete = await getUser.by({passwordResetCode: req.params.passwordResetCode});

    if(userToDelete == null) {
        requestChecker.returnCustomResponse(res, 404, "Not valid password reset code");
        return;
    }

    await DatabaseHandlerLogin.deleteUser(userToDelete);

    requestChecker.returnCustomResponse(res, 200, "User deleted successfully");
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
    const RequestUser = await getUser.by({username: req.session.user.username});

    if(!RequestUser.checkPermission("updateUserPermissions")){
        requestChecker.returnCustomResponse(res, 403, "You do not have permission to update user permissions");
        return;
    }

    try {
        const userToUpdate = await getUser.by({id: req.body.id});

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
    const RequestUser = await getUser.by({username: req.session.user.username});

    if(!RequestUser.checkPermission("updateUserPermissions")){
        requestChecker.returnCustomResponse(res, 403, "You do not have permission to update user permissions");
        return;
    }

    try {
        const userToUpdate = await getUser.by({id: req.body.id});

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