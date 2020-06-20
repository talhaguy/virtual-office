import { Request, Response } from "express"
import { CreateUser } from "../databaseModels"

// MARK: onUserSaveSuccess()

export interface OnUserSaveSuccessFunction {
    (req: Request, res: Response): void
}

export const onUserSaveSuccess: OnUserSaveSuccessFunction = (req, res) => {
    req.flash("info", "Thank you for registering. Please login.")
    res.redirect("/login")
}

// MARK: onUserSaveError()

export interface OnUserSaveErrorFunction {
    (req: Request, res: Response, err: any): void
}

export const onUserSaveError: OnUserSaveErrorFunction = (req, res, err) => {
    if (err.code === 11000) {
        req.flash("error", "Duplicate user")
    } else {
        req.flash("error", "Server error")
    }

    res.redirect("/register")
}

// MARK: registerHandler()

export function registerHandler(
    createUser: CreateUser,
    onUserSaveSuccess: OnUserSaveSuccessFunction,
    onUserSaveError: OnUserSaveErrorFunction,
    req: Request,
    res: Response
) {
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
