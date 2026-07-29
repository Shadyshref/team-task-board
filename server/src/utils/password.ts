import { env } from "../config/env.js";
import bcrypt from "bcryptjs";


export const hashedPassword =(password: string):Promise<string> => {
    return bcrypt.hash(password,env.BCRYPT_ROUNDS)
    
}


export const verifyPassword = (password: string, hashedPassword: string):Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword)
}