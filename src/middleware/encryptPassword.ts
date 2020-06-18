import { Request, Response, NextFunction } from "express"

// MARK: encryptPassword()

export interface BcryptHashFunction {
    (
        data: any,
        saltOrRounds: string | number,
        callback?: (err: Error, encrypted: string) => void
    ): Promise<string>
}

export function encryptPassword(
    hashFunction: BcryptHashFunction,
    encryptPasswordFailFunction: EncryptPasswordFailFunction,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const password = req.body.password as string
    const saltRounds = 10

    hashFunction(password, saltRounds)
        .then((hashedPassword) => {
            req.body.password = hashedPassword
            next()
        })
        .catch(() => {
            encryptPasswordFailFunction(req, res)
        })
}

// MARK: encryptPasswordFail()

export interface EncryptPasswordFailFunction {
    (req: Request, res: Response): void
}

export const encryptPasswordFail: EncryptPasswordFailFunction = (req, res) => {
    req.flash("error", "Something went wrong")
    res.redirect("/register")
}
