import { Request, Response, NextFunction } from "express"
import { validateEmail, validatePassword } from "../../shared-src/validation"

export function registrationValidation(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log("in registrationValidation")

    const username = req.body.username as string
    const password = req.body.password as string

    const isUsernameValid = validateEmail(username)
    const isPasswordValid = validatePassword(password)

    if (!isUsernameValid) {
        req.flash("error", "Wrong username format")
    }

    if (!isPasswordValid) {
        req.flash("error", "Wrong password format")
    }

    if (!isUsernameValid || !isPasswordValid) {
        res.redirect("/register")
        return
    }

    // TODO: hash password

    next()
}
