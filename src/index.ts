import express from "express";
import { log } from "./util/log";
import { config } from "process";
import { ConfigHandler } from "./util/configHandler";

const app = express();

ConfigHandler.setup();

app.use(express.json());


app.listen(ConfigHandler.config.settings.appPort, () => {
  log(`Server is running on port ${ConfigHandler.config.settings.appPort}`, "info");
});