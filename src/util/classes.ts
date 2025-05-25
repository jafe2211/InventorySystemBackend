import { log } from "./log";

export class user{
    id: number;
    username: string;
    email: string;
    permissions: string[];
    superuser: boolean;

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
    }

    addPermissions(permission:string[]):void {
        for (const perm in permission) {
            if(this.permissions.includes(perm)) continue;

            log("Added permission: " + perm + " to user: " + this.username);
            this.permissions.push(perm);
        }
    }

    addSuperuser():void {
        if(this.superuser) return;

        log("Added superuser permission to user: " + this.username);
        this.superuser = true;
    }

    removePermission(permission:string):void {
        if(!this.permissions.includes(permission)) return;

        log("Removed permission: " + permission + " from user: " + this.username);
        this.permissions = this.permissions.filter(perm => perm !== permission);
    }

    removePermissions(permissions:string[]):void {
        for (const perm in permissions) {
            if(this.permissions.includes(perm)) continue;

            log("Removed permission: " + perm + " to user: " + this.username);
            this.permissions = this.permissions.filter(permiss => permiss != perm);
        }
    }

    removeSuperuser():void {
        if(!this.superuser) return;

        log("Removed superuser permission from user: " + this.username);
        this.superuser = false;
    }
}