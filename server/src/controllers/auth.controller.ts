import { env } from "../config/env.js";
import { sendSuccess } from "../utils/api-response.js";
import { getAuthCookieOptions, getClearCookieOptions } from "../utils/cookie-options.js";
import type { Request, Response } from "express";
import type { LoginInput, RegisterInput } from "../validation/auth.validation.js";
import { getCurrentUser, loginUser, registerUser } from "../services/auth.service.js";



export async function registerController (req:Request,res:Response):Promise<void> {

    const input = req.validated.body as RegisterInput;

    const result  = await registerUser(input)

    res.cookie(
        env.COOKIE_NAME,
        result.accessToken,
        getAuthCookieOptions()
    )

     sendSuccess(
    res,
    201,
    { 
        user:result.user,
     },
    "Account created successfully",
  );
    
}

export async function loginController (req:Request,res:Response):Promise<void> {
    const input = req.validated.body as LoginInput;

    const result  = await loginUser(input)

    res.cookie(
    env.COOKIE_NAME,
    result.accessToken,
    getAuthCookieOptions(),
       );
        sendSuccess(
    res,
    200,
    {
      user: result.user,
    },
    "Logged in successfully",
  );
}


    
export async function currentUserController (req:Request,res:Response):Promise<void> {
    const user = await getCurrentUser(req.user.id)
    sendSuccess(res,200,{user})
}


export  function logoutController (req:Request,res:Response) {
    res.clearCookie(
        env.COOKIE_NAME,
        getClearCookieOptions()
    )
    sendSuccess(res,200,null,"Logged out successfully")
}