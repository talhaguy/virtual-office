import { IVerifyOptions } from "passport-local"
import { User } from "../models"
import { Document, Model } from "mongoose"

interface VerifyFunctionWithDeps {
    (
        UserModel: Model<User & Document, {}>,
        username: string,
        password: string,
        done: (error: any, user?: any, options?: IVerifyOptions) => void
    ): void
}

export const verifyFunction: VerifyFunctionWithDeps = (
    UserModel,
    username,
    password,
    done
) => {
    UserModel.findOne({ username })
        .then((user) => {
            if (user.password === password) {
                done(null, user)
            } else {
                done(null, false, {
                    message: "Username or password is not correct",
                })
            }
        })
        .catch(() => {
            done(null, false, {
                message: "Username or password is not correct",
            })
        })
}

interface SerializeUser {
    (user: User & Document, done: (err: any, id?: string) => void): void
}

export const serializeUser: SerializeUser = (user, cb) => {
    cb(null, user._id)
}

interface DeserializeUserWithDeps {
    (
        UserModel: Model<User & Document, {}>,
        id: string,
        done: (err: any, user?: User) => void
    ): void
}

export const deserializeUser: DeserializeUserWithDeps = (UserModel, id, cb) => {
    UserModel.findById(id)
        .then((user) => {
            cb(null, user)
        })
        .catch(() => {
            cb(new Error("Deserialization failed"))
        })
}
