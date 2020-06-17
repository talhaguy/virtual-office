import { IVerifyOptions } from "passport-local"
import { User } from "../models"
import { Document, Model } from "mongoose"
import { validateEmail, validatePassword } from "../../shared-src/validation"

interface PassportVerifyFunctionDoneParameterFunction {
    (error: any, user?: any, options?: IVerifyOptions): void
}

interface VerifyFunctionWithDeps {
    (
        UserModel: Model<User & Document, {}>,
        hashCompare: (
            data: any,
            encrypted: string,
            callback?: (err: Error, same: boolean) => void
        ) => Promise<boolean>,
        verifyFunctionNoUserFound: VerifyFunctionNoUserFoundFunction,
        verifyFunctionUserFound: VerifyFunctionUserFoundFunction,
        username: string,
        password: string,
        done: PassportVerifyFunctionDoneParameterFunction
    ): void
}

export enum ErrorMessages {
    WrongUsernameOrPassword = "Username or password is not correct",
    InvalidPatternUsernameOrPassword = "Username or password is not correct format",
}

export const verifyFunction: VerifyFunctionWithDeps = (
    UserModel,
    hashCompare,
    verifyFunctionNoUserFound,
    verifyFunctionUserFound,
    username,
    password,
    done
) => {
    let user: User & Document

    if (validateEmail(username) && validatePassword(password)) {
        UserModel.findOne({ username })
            .then((userFromDb) => {
                user = userFromDb
                return hashCompare(password, userFromDb.password)
            })
            .then((result) => {
                verifyFunctionUserFound(result, done, user)
            })
            .catch(() => {
                verifyFunctionNoUserFound(done)
            })
    } else {
        done(null, false, {
            message: ErrorMessages.InvalidPatternUsernameOrPassword,
        })
    }
}

interface VerifyFunctionNoUserFoundFunction {
    (done: PassportVerifyFunctionDoneParameterFunction): void
}

export const verifyFunctionNoUserFound: VerifyFunctionNoUserFoundFunction = (
    done: PassportVerifyFunctionDoneParameterFunction
) => {
    done(null, false, {
        message: ErrorMessages.WrongUsernameOrPassword,
    })
}

interface VerifyFunctionUserFoundFunction {
    (
        result: boolean,
        done: PassportVerifyFunctionDoneParameterFunction,
        user: User & Document
    ): void
}

export const verifyFunctionUserFound: VerifyFunctionUserFoundFunction = (
    result,
    done,
    user
) => {
    if (result) {
        done(null, user)
    } else {
        done(null, false, {
            message: ErrorMessages.WrongUsernameOrPassword,
        })
    }
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
