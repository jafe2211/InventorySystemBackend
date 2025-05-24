export class Cryption {
    static generateSalt(length:number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"§$%&/()=?*+~#-_.:,;<>|';
        let salt = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            salt += characters[randomIndex];
        }
        return salt;
    }
}