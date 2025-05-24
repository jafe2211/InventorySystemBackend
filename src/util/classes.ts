import { DatabaseHandlerLogin } from "./databaseHandlerLogin";

export class user{
    id: number;
    username: string;
    email: string;
    permissions: string;
    superuser: boolean;

    constructor(username: string, email: string, id:number, permissions: string, superuser: boolean) {
        this.username = username;
        this.email = email;
        this.id = id;
        this.permissions = permissions;
        this.superuser = superuser;
    }
}