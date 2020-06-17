import { IVerifyOptions } from "passport-local"
import { User } from "../models"
import { Document, Model } from "mongoose"
import { validateEmail, validatePassword } from "../../shared-src/validation"
import { ErrorMessages } from "./constants"

// MARK: verifyFunction()

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
            .then((doesHashedPasswordMatch) => {
                verifyFunctionUserFound(doesHashedPasswordMatch, done, user)
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

// MARK: verifyFunctionNoUserFound()

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

// MARK: verifyFunctionUserFound()

interface VerifyFunctionUserFoundFunction {
    (
        doesHashedPasswordMatch: boolean,
        done: PassportVerifyFunctionDoneParameterFunction,
        user: User & Document
    ): void
}

export const verifyFunctionUserFound: VerifyFunctionUserFoundFunction = (
    doesHashedPasswordMatch,
    done,
    user
) => {
    if (doesHashedPasswordMatch) {
        done(null, user)
    } else {
        done(null, false, {
            message: ErrorMessages.WrongUsernameOrPassword,
        })
    }
}

// MARK: serializeUser()

interface PassportSerializeUserFunctionDoneParameterFunction {
    (err: any, id?: string): void
}

interface SerializeUser {
    (
        user: User & Document,
        done: PassportSerializeUserFunctionDoneParameterFunction
    ): void
}

export const serializeUser: SerializeUser = (user, done) => {
    done(null, user._id)
}

// MARK: deserializeUser()

interface PassportDeserializeUserFunctionDoneParameterFunction {
    (err: any, user?: User): void
}

interface DeserializeUserWithDeps {
    (
        UserModel: Model<User & Document, {}>,
        id: string,
        done: PassportDeserializeUserFunctionDoneParameterFunction
    ): void
}

export const deserializeUser: DeserializeUserWithDeps = (
    UserModel,
    id,
    done
) => {
    UserModel.findById(id)
        .then((user) => {
            done(null, user)
        })
        .catch(() => {
            done(new Error("Deserialization failed"))
        })
}
