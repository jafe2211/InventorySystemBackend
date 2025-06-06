import fs from 'fs';

import { ConfigHandler } from './configHandler';
import clc from 'cli-color';

// Get the time and date of the start of the program
const TimeWhenStarted = new Date();
const TimeString = TimeWhenStarted.toLocaleString('de-DE', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
}).replace(/:/g, '-').replace(/,/g, '');

var LastLog:string; 

export function log(message, type?: string) {

    if(type == null || type == undefined) {
        type = "standard";
    }

    //get the current time
    const Time = new Date();

    //write Message to Log file
    if (ConfigHandler.config.settings.logToFile) {
        if (!fs.existsSync(ConfigHandler.config.settings.logPath)) {
            fs.mkdirSync(ConfigHandler.config.settings.logPath);
        }

        if(type == "standard") {
            fs.appendFile("./Logs/" + TimeString + ".txt", `[STAN] [${Time.toLocaleTimeString('de-DE',)}] ${message}\n`, (err) => {
                if (err) {
                  log("Error while tring to write in Log file: " + err, "error");
                }
              })
            }

            if(type == "error") {
                fs.appendFile("./Logs/" + TimeString + ".txt", `[ERRO] [${Time.toLocaleTimeString('de-DE',)}] [ERROR] ${message}\n`, (err) => {
                    if (err) {
                      log("Error while tring to write in Log file: " + err, "error");
                    }
                  })
            }
            
            if(type == "info") {
                fs.appendFile("./Logs/" + TimeString + ".txt", `[INFO] [${Time.toLocaleTimeString('de-DE',)}] [INFO] ${message}\n`, (err) => {
                    if (err) {
                      log("Error while tring to write in Log file: " + err, "error");
                    }
                  })
            }
            
            if(type == "warn") {
                fs.appendFile("./Logs/" + TimeString + ".txt", `[WARN] [${Time.toLocaleTimeString('de-DE',)}] [WARN] ${message}\n`, (err) => {
                    if (err) {
                      log("Error while tring to write in Log file: " + err, "error");
                    }
                  })
            }
            if(type == "debug") {
                fs.appendFile("./Logs/" + TimeString + ".txt", `[DEBU] [${Time.toLocaleTimeString('de-DE',)}] [DEBUG] ${message}\n`, (err) => {
                    if (err) {
                      log("Error while tring to write in Log file: " + err, "error");
                    }
                  })
            }
  }


  //log the message to the console
  if (ConfigHandler.config.settings.logToConsole) {
    if(type == "standard") {
        console.log(`[${Time.toLocaleTimeString('de-DE',)}] ${message}`)
        LastLog = `${message}`;
    }
    if(type == "error") {
        console.log(clc.red(`[${Time.toLocaleTimeString('de-DE',)}] [ERROR] ${message}`));
        LastLog = `[ERROR] ${message}`;
    }
    if(type == "info") {
        console.log(clc.blue(`[${Time.toLocaleTimeString('de-DE',)}] [INFO] ${message}`));
        LastLog = `[INFO] ${message}`;
    }
    if(type == "warn") {
        console.log(clc.yellow(`[${Time.toLocaleTimeString('de-DE',)}] [WARN] ${message}`));
        LastLog = `[WARN] ${message}`;
    }
    if(type == "success") {
        console.log(clc.green(`[${Time.toLocaleTimeString('de-DE',)}] [SUCCESS] ${message}`));
        LastLog = `[SUCCESS] ${message}`;
    }
    if(type == "debug") {
        console.log(clc.green(`[${Time.toLocaleTimeString('de-DE',)}] [DEBUG] ${message}`));
        LastLog = `[SUCCESS] ${message}`;
    }
  }
}

export function logEnd(){
  var dividingString:string = "";

  for(let i = 0; i < LastLog.length; i++){
    dividingString += "-"
  }

  log(dividingString)
}