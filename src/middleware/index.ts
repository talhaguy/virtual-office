import {
    encryptPassword as _encryptPassword,
    EncryptPasswordFailFunction,
    encryptPasswordFail,
    BcryptHashFunction,
} from "./encryptPassword"
import { hash } from "bcrypt"
import { Request, Response, NextFunction } from "express"

export const encryptPassword = ((
    hash: BcryptHashFunction,
    encryptPasswordFail: EncryptPasswordFailFunction
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        return _encryptPassword(hash, encryptPasswordFail, req, res, next)
    }
})(hash, encryptPasswordFail)

export { registrationValidation } from "./registrationValidation"
