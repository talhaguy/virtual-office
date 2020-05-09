import {
    verifyFunction as _verifyFunction,
    deserializeUser as _deserializeUser,
} from "./localStrategy"
import { UserModel } from "../databaseModels"
import { User } from "../models"
import { VerifyFunction } from "passport-local"

export const verifyFunction = ((UserModel) => {
    const verifyFunction: VerifyFunction = (username, password, done) =>
        _verifyFunction(UserModel, username, password, done)
    return verifyFunction
})(UserModel)

interface DeserializeUser {
    (id: string, done: (err: any, user?: User) => void): void
}

export const deserializeUser = ((UserModel) => {
    const deserializeUser: DeserializeUser = (id, done) =>
        _deserializeUser(UserModel, id, done)
    return deserializeUser
})(UserModel)

export { serializeUser } from "./localStrategy"
