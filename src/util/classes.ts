import e from "express";
import { log } from "./log";

export class user{
    id: number;
    username: string;
    email: string;
    permissions: string[] = ["test", "test2"];
    superuser: boolean;
    static publicPermissions: string[] = [
        "updateUserPermissions"
    ];

    constructor(username: string, email: string, id:number, permissions: string[], superuser: boolean) {
        this.username = username;
        this.email = email;
        this.id = id;
        this.permissions = permissions;
        this.superuser = superuser;
    }

    checkPermission(permission:string):boolean {
        if(!(this.permissions.includes(permission))) return false;
        
        return true;
    }

    addPermission(permission:string):void {
        if(this.permissions.includes(permission)) return;

        log("Added permission: " + permission + " to user: " + this.username);
        this.permissions.push(permission);
        log("--------------------------------------------");
    }

    addPermissions(permission:string[]):void {
        for (const perm in permission) {
            log(permission[perm]);
            if(this.permissions.includes(permission[perm])) continue;

            this.permissions.push(permission[perm]);

            log("Added permission: " + permission[perm] + " to user: " + this.username);
        }
        log("--------------------------------------------");
    }

    addSuperuser():void {
        if(this.superuser) return;

        log("Added superuser permission to user: " + this.username);
        this.superuser = true;
        log("--------------------------------------------");
    }

    removePermission(permission:string):void {
        if(!this.permissions.includes(permission)) return;

        log("Removed permission: " + permission + " from user: " + this.username);
        this.permissions = this.permissions.filter(perm => perm !== permission);
        log("--------------------------------------------");
    }

    removePermissions(permissions:string[]):void {
        for (const perm in permissions) {
            if(this.permissions.includes(perm)) continue;

            log("Removed permission: " + perm + " to user: " + this.username);
            this.permissions = this.permissions.filter(permiss => permiss != perm);
        }
        log("--------------------------------------------");
    }

    removeSuperuser():void {
        if(!this.superuser) return;

        log("Removed superuser permission from user: " + this.username);
        this.superuser = false;
        log("--------------------------------------------");
    }

    replacePermissions(permissions:string[]):void {
        log("Replaced permissions of user: " + this.username);
        this.permissions = permissions;
        log("--------------------------------------------");
    }
}