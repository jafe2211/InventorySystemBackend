import express from "express";
import session from "express-session";
import cors from "cors";

import { log } from "./util/log";
import { config } from "process";
import { ConfigHandler } from "./util/configHandler";
import { main } from "./util/main";
import { loginRouter } from "./routes/loginRouter";
import bodyParser from "body-parser";

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




(async () => {
  if (await main.startup() == true) {
    app.listen(ConfigHandler.config.settings.appPort, () => {
      log(`Server is running on port ${ConfigHandler.config.settings.appPort}`, "info");
    });
  }
})();