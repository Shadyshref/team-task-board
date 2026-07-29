import type { ErrorCode } from "./error-codes.js";



export class AppError extends Error {
    readonly  statusCode:number;
    readonly  code:ErrorCode;
    details?:unknown;

    constructor(
        statusCode: number,
        code: ErrorCode,
        message: string,
        details?: unknown,
    ){
        super(message)
        this.statusCode=statusCode
        this.code=code
        

        if(details !== undefined){
            this.details=details
        }
        Error.captureStackTrace(this, AppError)
    }


}