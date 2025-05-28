import express from "express";
import session from "express-session";
import cors from "cors";
import bodyParser from "body-parser";

import { log } from "./util/log";
import { ConfigHandler } from "./util/configHandler";
import { main } from "./util/main";
import { loginRouter } from "./routes/loginRouter";
import { user } from "./util/user";
import { userManagementRouter } from "./routes/userManagementRouter";
import { MailHandler } from "./util/mailHandler";

const app = express();

app.use(bodyParser.json());

app.use(
  cors({
      origin: "*",
  })
);

app.use(session({
  secret: ConfigHandler.config.Security.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}));

app.use("/login", loginRouter);
app.use("/userManagement", userManagementRouter);

(async () => {
  if (await main.startup() == true) {
    app.listen(ConfigHandler.config.settings.appPort, () => {
      log(`Server is running on port ${ConfigHandler.config.settings.appPort}`, "info");
    });
  }
})();