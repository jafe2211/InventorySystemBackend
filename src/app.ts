import express from "express";
import fs from "fs";

import { log, LogLevel } from "./utils/log";
import { Config } from "./utils/config";

const app = express();

app.use(express.json())

export default app;