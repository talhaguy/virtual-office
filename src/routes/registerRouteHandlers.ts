import { Request, Response } from "express"
import { CreateUser } from "../databaseModels"

export function onUserSaveSuccess(req: Request, res: Response) {
    req.flash("info", "Thank you for registering. Please login.")
    res.redirect("/login")
}

export function onUserSaveError(req: Request, res: Response, err: any) {
    if (err.code === 11000) {
        req.flash("error", "Duplicate user")
        res.redirect("/register")
        return
    } else {
        req.flash("error", "Server error")
        res.redirect("/register")
        return
    }
}

export function registerHandler(
    createUser: CreateUser,
    onUserSaveSuccess: (req: Request, res: Response) => void,
    onUserSaveError: (req: Request, res: Response, err: any) => void,
    req: Request,
    res: Response
) {
    console.log("in register handler...", req.body.username, req.body.password)

    const user = createUser({
        username: req.body.username,
        password: req.body.password,
    })
    user.save()
        .then(() => {
            onUserSaveSuccess(req, res)
        })
        .catch((err: any) => {
            onUserSaveError(req, res, err)
        })
}
