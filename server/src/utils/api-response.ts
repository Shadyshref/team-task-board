
import type { Response } from "express";
export function sendSuccess<T> (
    response: Response,
    statusCode: number,
    data: T,
    message?: string,
    
):Response {
   if(message){
     return response.status(statusCode).json({
        success: true,
        message,
        data
    })
   }
    return response.status(statusCode).json({
        success: true,
        message,
        data
    })

}


export function sendNoContent(response: Response):Response {
    return response.status(204).send()
    
    
}