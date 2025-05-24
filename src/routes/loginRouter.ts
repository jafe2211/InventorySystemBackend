import express from "express";
import { requestChecker } from "../util/requestChecker";
import { log } from "../util/log";
import { DatabaseHandlerLogin } from "../util/databaseHandlerLogin";

export const loginRouter = express.Router();

declare module "express-session" {
    interface SessionData {
      user: string;
    }
  }

/*loginRouter.post("/test", (req, res) => {
    req.session.user = "Login test successful";
    req.session.save()
    
    res.status(200).json({
        message: "Login test successful",
        data: req.session
    });
}); */

loginRouter.post("/register", (req, res) => {
    if(!requestChecker.checkForDataInBody(req, ["username"]) == true){
        requestChecker.returnEmptyBodyResponse(res);
        return;
    }

    DatabaseHandlerLogin.checkIfUserExsists(req.body.username);

}); 