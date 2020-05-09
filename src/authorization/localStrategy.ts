import { VerifyFunction } from "passport-local"
import { User } from "../models"
import { UserModel } from "../databaseModels"
import { Document } from "mongoose"

export const verifyFunction: VerifyFunction = (username, password, done) => {
    UserModel.findOne({ username })
        .then((user) => {
            if (user.password === password) {
                done(null, user)
            } else {
                done(null, false, {
                    message: "Wong password",
                })
            }
        })
        .catch(() => {
            done(null, false, {
                message: "User not found",
            })
        })
}

interface SerializeUser {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (user: User & Document, done: (err: any, id?: string) => void): void
}

export const serializeUser: SerializeUser = (user, cb) => {
    cb(null, user._id)
}

interface DeserializeUser {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (id: string, done: (err: any, user?: User) => void): void
}

export const deserializeUser: DeserializeUser = (id, cb) => {
    UserModel.findById(id)
        .then((user) => {
            cb(null, user)
        })
        .catch(() => {
            cb(new Error("Deserialization failed"))
        })
}
