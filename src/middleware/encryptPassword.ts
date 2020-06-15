import { Request, Response, NextFunction } from "express"
import { hash, compare } from "bcrypt"

const myPlaintextPassword = "s0//P4$$w0rD"
const someOtherPlaintextPassword = "not_bacon"

export function encryptPassword(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const password = req.body.password as string

    console.log("in encryptPassword")
    const saltRounds = 10

    hash(password, saltRounds)
        .then((hashedPassword) => {
            req.body.password = hashedPassword
            next()
        })
        .catch((err) => {
            req.flash("error", "Something went wrong")
            res.redirect("/register")
            return
        })
}
