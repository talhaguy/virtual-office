import { Request, Response } from "express"
import { UserModel } from "../databaseModels"

export function registerHandler(req: Request, res: Response) {
    const user = new UserModel({
        username: req.body.username,
        password: req.body.password,
    })
    user.save()
        .then(() => {
            res.redirect("/login")
        })
        .catch((err: any) => {
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
        })
}
