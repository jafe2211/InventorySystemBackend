import express from 'express';

import { log, logEnd } from '../Modules/ModuleLib/util/log';
import { requestChecker } from '../util/requestChecker';
import { DatabaseHandlerLogin } from '../util/databaseHandlerLogin';
import { user, UserPermissions } from '../util/user';
import { MailHandler } from '../Modules/ModuleLib/util/mailHandler';
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
        if(!requestChecker.checkForDataInBody(req, ["username", "email", "permissions", "superuser"]) == true){
            requestChecker.returnEmptyBodyResponse(res);
            log("Request Body was empty or missing required Data!", "error");
            return;
        }

        if(await DatabaseHandlerLogin.checkIfUserExsists(req.body.username) == true){
            requestChecker.returnCustomResponse(res, 400, "Username already exists");
            log("Username already exists", "error");
            return;
        }

        const user = await DatabaseHandlerLogin.createNewUser(req.body.username, req.body.email, req.body.permissions, req.body.superuser);

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

    await user.resetPassword();

    if(await DatabaseHandlerLogin.updateFullUserInfo(user) != true){
        return requestChecker.returnCustomResponse(res, 500, "There was an internal server error");
    } 
    requestChecker.returnCustomResponse(res, 200, "Send password reset code to user")
    logEnd();
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

userManagementRouter.delete('/deleteUser/', async (req, res) => {
    log("deleteUser request received");

    if(!requestChecker.checkForDataInBody(req, ["id"]) == true){
        requestChecker.returnEmptyBodyResponse(res);
        return;
    }

    if(req.session.user == undefined || req.session.user == null) {
        requestChecker.returnCustomResponse(res, 401, "You are not logged in");
        return;
    }

    const RequestUser = await getUser.by({id: req.session.user.id});

    if(!RequestUser.checkPermission(UserPermissions.DELETE_USER)){
        requestChecker.returnCustomResponse(res, 403, "You do not have permission to view all users");
        return;
    }

    const userToDelete = await getUser.by({id: req.body.id});

    if(userToDelete == null) {
        requestChecker.returnCustomResponse(res, 404, "Not valid id");
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

    if(!RequestUser.checkPermission(UserPermissions.UPDATE_USER)){
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

    if(!RequestUser.checkPermission(UserPermissions.UPDATE_USER)){
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

userManagementRouter.get("/getAllPermissions", async (req, res) =>{
    res.status(200).json({
        permissions: user.permissionList
    });
})

userManagementRouter.get("/getAllUsers", async (req, res) => {
    log("getAllUsers request received");

    if(req.session.user == undefined || req.session.user == null) {
        requestChecker.returnCustomResponse(res, 401, "You are not logged in");
        return;
    }

    const RequestUser = await getUser.by({username: req.session.user.username});

    if(!RequestUser.checkPermission(UserPermissions.VIEW_ALL_USERS)){
        requestChecker.returnCustomResponse(res, 403, "You do not have permission to view all users");
        return;
    }

    const users = await DatabaseHandlerLogin.getAllUsers();

    if(users == null) {
        requestChecker.returnCustomResponse(res, 500, "Internal server error");
    }

    res.status(200).json({"users": users});
    log("getAllUsers request successful");
    logEnd();
});

userManagementRouter.post("/updateUser", async (req, res) => {
    log("updateUser request received"); 
    if(!requestChecker.checkForDataInBody(req, ["id", "username", "email", "permissions", "superuser"]) == true){
        requestChecker.returnEmptyBodyResponse(res);
        return;
    }

    if(req.session.user == undefined || req.session.user == null) {
        requestChecker.returnCustomResponse(res, 401, "You are not logged in");
        return;
    }
    const RequestUser = await getUser.by({id: req.session.user.id});

    if(!RequestUser.checkPermission(UserPermissions.UPDATE_USER)){
        requestChecker.returnCustomResponse(res, 403, "You do not have permission to update user");
        return;
    }

    const userToUpdate = await getUser.by({id: req.body.id});

    if(userToUpdate == null) {
        requestChecker.returnCustomResponse(res, 404, "User not found");
        return;
    }

    userToUpdate.username = req.body.username;
    userToUpdate.email = req.body.email;
    userToUpdate.permissions = req.body.permissions;
    userToUpdate.superuser = req.body.superuser;

    await DatabaseHandlerLogin.updateUserInfo(userToUpdate);
    requestChecker.returnCustomResponse(res, 200, "User updated successfully");
    log("updateUser request successful for user: " + req.body.username);
    log("--------------------------------------------");
})