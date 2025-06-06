import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { log } from "./log";

export class requestChecker {
    static checkForParameter(req: Request, parameters: string): boolean {
        
        if(req.params[parameters] === undefined || req.params[parameters] === "") {
            log("Recived Empty request parameters", "error");
            return false;
        }
        return true;
    }

    private static checkIfBodyIsEmpty(req):boolean {
        if(req.body == undefined || req.body == "") {
            return true;
        }
        return false;
    }

    static checkForDataInBody(req, data: string[]): boolean {
        if(this.checkIfBodyIsEmpty(req) == true) {
            log("Recived Empty register request", "error");
            return false;
        }

        var returnData: { [key: string]: boolean } = {};

        try {
            for (const item of data) {
                if (req.body[item] == undefined|| req.body[item] == null || req.body[item] == "") {
                    return false;
                }
            }
            return true;
        } catch (error) {
            log("Error checking for data in body: " + error, "error");
            return false;
        }
    }

    static returnEmptyBodyResponse(res): void {
        res.status(400).json({
            message: "Request body is empty or missing required data"
        });
    }

    static returnEmptyParametersResponse(res: Response<any>) {
        res.status(400).json({
            message: "Request parameters is empty or missing required data"
        });
    }

    static returnCustomResponse(res, statusCode: number, message: string): void {
        res.status(statusCode).json({
            message: message
        });
    }
}