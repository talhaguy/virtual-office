import { Request, Response } from "express"
import { CreateUser } from "../databaseModels"

export function onUserSaveSuccess(res: Response) {
    res.redirect("/login")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function onUserSaveError(res: Response, err: any) {
    if (err.code === 11000) {
        res.status(400).send({
            status: "ERROR",
            message: "Duplicate user",
        })
    } else {
        res.status(500).send({
            status: "ERROR",
            message: "Server error",
        })
    }
}

export function registerHandler(
    createUser: CreateUser,
    onUserSaveSuccess: (res: Response) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUserSaveError: (res: Response, err: any) => void,
    req: Request,
    res: Response
) {
    const user = createUser({
        username: req.body.username,
        password: req.body.password,
    })
    user.save()
        .then(() => {
            onUserSaveSuccess(res)
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((err: any) => {
            onUserSaveError(res, err)
        })
}
