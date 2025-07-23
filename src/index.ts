import express from "express";
import session from "express-session";
import cors from "cors";
import bodyParser from "body-parser";

import { log, logEnd } from "./Modules/ModuleLib/util/log";
import { ConfigHandler } from "./Modules/ModuleLib/util/configHandler";
import { main } from "./util/main";
import { loginRouter } from "./routes/loginRouter";
import { userManagementRouter } from "./routes/userManagementRouter";
import { getUser } from "./util/getUserInfo";

const app = express();

app.use(bodyParser.json());

const whitelist = ['http://localhost:4200', 'http://localhost:8081'];
const corsOptions = {
  credentials: true, 
  origin: (origin, callback) => {
    if(whitelist.includes(origin))
      return callback(null, true)

      callback();
  }
}

app.use(cors(corsOptions));

app.use(session({
  secret: ConfigHandler.config.settings.security.secretIv,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}));

app.use("/login", loginRouter);

app.use("/userManagement", userManagementRouter);

(async () => {
  if (await main.startup() == true) {
    app.listen(ConfigHandler.config.settings.app.appPort, async () => {
      log(`Server is running on port ${ConfigHandler.config.settings.app.appPort}`, "info");
      log("startup done!", "success")
      logEnd();
    });

  }
})();