import { VerifyFunction } from "passport-local"
import { compare } from "bcrypt"
import {
    verifyFunction as _verifyFunction,
    deserializeUser as _deserializeUser,
    verifyFunctionNoUserFound,
    verifyFunctionUserFound,
    PassportDeserializeUserFunctionDoneParameterFunction,
} from "./localStrategy"
import { UserModel } from "../databaseModels"

export const verifyFunction = ((UserModel) => {
    const verifyFunction: VerifyFunction = (username, password, done) =>
        _verifyFunction(
            UserModel,
            compare,
            verifyFunctionNoUserFound,
            verifyFunctionUserFound,
            username,
            password,
            done
        )
    return verifyFunction
})(UserModel)

export interface DeserializeUserFunction {
    (
        id: string,
        done: PassportDeserializeUserFunctionDoneParameterFunction
    ): void
}

export const deserializeUser = ((UserModel) => {
    const deserializeUser: DeserializeUserFunction = (id, done) =>
        _deserializeUser(UserModel, id, done)
    return deserializeUser
})(UserModel)

export { serializeUser } from "./localStrategy"
