import { NextFunction, Request, Response } from "express";
import {Errors} from "./constants"
import { ClientException, EmailTakenException, InvalidRequestBodyException, UsernameTakenException, UserNotFoundException } from "./exceptions";

export class ErrorExceptionHandler {

    public handle(
        error: Error,
        req: Request,
        res: Response,
        next: NextFunction
    ) : Response {

        if (error instanceof InvalidRequestBodyException) {
            return res.status(400).json({
                error: Errors.ValidationError,
                data: undefined,
                success: false,
            })
        }

        if (error instanceof UsernameTakenException) {
            return res.status(404).json({
                error: Errors.UsernameAlreadyTaken,
                data: undefined,
                success: false,
            })
        }


        if (error instanceof EmailTakenException) {
            return res.status(404).json({
                error: Errors.EmailAlreadyInUse,
                data: undefined,
                success: false,
            })
        }

        if (error instanceof ClientException) {
            return res.status(400).json({
                error: Errors.ClientError,
                data: undefined,
                success: false,
            })
        }

        if (error instanceof UserNotFoundException) {
            return res.status(400).json({
                error: Errors.UserNotFound,
                data: undefined,
                success: false,
            })
        }

        return res.status(500).json({
            error: Errors.ServerError,
            data: undefined,
            success: false,
            message: error.message,
          });


    }
}