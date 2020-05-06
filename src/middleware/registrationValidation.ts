import { Request, Response, NextFunction } from "express"

export function registrationValidation(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const username = req.body.username as string
    const password = req.body.password as string

    if (!username || !password) {
        res.status(401).send({
            status: "ERROR",
            message:
                (!username ? "Empty username. " : "") +
                (!password ? "Empty password." : ""),
        })
        return
    }

    const isUsernameValid =
        username.match(
            "^[A-Za-z0-9._'%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$|^$"
        ) !== null
    const isPasswordValid =
        password.match("\\s") === null && password.length >= 6

    if (!isUsernameValid || !isPasswordValid) {
        res.status(401).send({
            status: "ERROR",
            message:
                (!isUsernameValid ? "Wrong username format. " : "") +
                (!isPasswordValid ? "Wrong password format." : ""),
        })
        return
    }

    next()
}
