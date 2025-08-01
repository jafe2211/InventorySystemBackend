//defining a class for cryptographic utilities
export class Cryption {

    //method to generate a random salt of specified length
    static generateSalt(length:number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"§$%&/()=?*+~#-_.:,;<>|'; // characters used for the salt
        let salt = '';  // initialize an empty string for the Final salt

        // loop to generate a random salt of the specified length
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length); // generate a random index based on the length of the characters string
            salt += characters[randomIndex]; // append a random character from the characters string to the salt
        }
        
        return salt;
    }

    //method to generate a random reset code of specified length
    static generateResetCode(length:number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // characters used for the reset code
        let resetCode = ''; // initialize an empty string for the reset code

        // loop to generate a random reset code of the specified length
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length); // generate a random index based on the length of the characters string
            resetCode += characters[randomIndex]; // append a random character from the characters string to the reset code
        }

        return resetCode;
    }
}