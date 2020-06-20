import {
    verifyFunction,
    verifyFunctionNoUserFound,
    verifyFunctionUserFound,
    serializeUser,
    deserializeUser,
} from "./localStrategy"
import { ErrorMessages } from "./constants"
import { compare } from "bcrypt"
import { UserModel } from "../databaseModels"
import { Document } from "mongoose"
import { User } from "../models"

jest.mock("bcrypt")
jest.mock("../databaseModels")

describe("localStrategy", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("verifyFunction()", () => {
        const username = "username@site.com"
        const password = "plain-text-pwd"
        const doneFunc = jest.fn()
        const verifyFunctionNoUserFound = jest.fn()
        const verifyFunctionUserFound = jest.fn()

        beforeEach(() => {
            jest.clearAllMocks()
        })

        it("should call done with invalid pattern message if username or password validation fails", () => {
            const wrongUserName = "username"
            const wrongPassword = "1234"
            UserModel.findOne = jest.fn()

            // wrong username
            verifyFunction(
                UserModel,
                compare,
                verifyFunctionNoUserFound,
                verifyFunctionUserFound,
                wrongUserName,
                password,
                doneFunc
            )

            expect(doneFunc).toBeCalledWith(null, false, {
                message: ErrorMessages.InvalidPatternUsernameOrPassword,
            })

            // wrong password
            doneFunc.mockClear()
            verifyFunction(
                UserModel,
                compare,
                verifyFunctionNoUserFound,
                verifyFunctionUserFound,
                username,
                wrongPassword,
                doneFunc
            )

            expect(doneFunc).toBeCalledWith(null, false, {
                message: ErrorMessages.InvalidPatternUsernameOrPassword,
            })
        })

        it("should call verifyFunctionNoUserFound if user is NOT found", (done) => {
            const verifyFunctionNoUserFound = jest
                .fn()
                .mockImplementation(() => {
                    expect(verifyFunctionNoUserFound).toBeCalledWith(doneFunc)
                    done()
                })
            UserModel.findOne = jest.fn().mockRejectedValue({})

            verifyFunction(
                UserModel,
                compare,
                verifyFunctionNoUserFound,
                verifyFunctionUserFound,
                username,
                password,
                doneFunc
            )
        })

        it("should check password hash and then call verifyFunctionUserFound if user is found", (done) => {
            const doesPasswordMatch = true
            const compare = jest.fn().mockResolvedValue(doesPasswordMatch)
            const user = {
                password: "pwd-from-db",
            }
            const verifyFunctionUserFound = jest.fn().mockImplementation(() => {
                expect(compare).toBeCalledWith(password, user.password)
                expect(verifyFunctionUserFound).toBeCalledWith(
                    doesPasswordMatch,
                    doneFunc,
                    user
                )
                done()
            })
            UserModel.findOne = jest.fn().mockResolvedValueOnce(user)

            verifyFunction(
                UserModel,
                compare,
                verifyFunctionNoUserFound,
                verifyFunctionUserFound,
                username,
                password,
                doneFunc
            )
        })
    })

    describe("verifyFunctionNoUserFound()", () => {
        it("should run the done callback with the correct error message", () => {
            const done = jest.fn()
            verifyFunctionNoUserFound(done)
            expect(done).toBeCalledWith(null, false, {
                message: ErrorMessages.WrongUsernameOrPassword,
            })
        })
    })

    describe("verifyFunctionUserFound()", () => {
        const done = jest.fn()
        const user: User & Document = {
            username: "username@site.com",
            password: "hashed-pwd",
        } as User & Document

        beforeEach(() => {
            jest.clearAllMocks()
        })

        it("should run the done callback with the correct error message if hashed password does NOT match", () => {
            const doesHashedPasswordMatch = false
            verifyFunctionUserFound(doesHashedPasswordMatch, done, user)
            expect(done).toBeCalledWith(null, false, {
                message: ErrorMessages.WrongUsernameOrPassword,
            })
        })

        it("should run the done callback with the user if hashed password matches", () => {
            const doesHashedPasswordMatch = true
            verifyFunctionUserFound(doesHashedPasswordMatch, done, user)
            expect(done).toBeCalledWith(null, user)
        })
    })

    describe("serializeUser()", () => {
        const done = jest.fn()
        const userId = "12345"
        const user: User & Document = {
            _id: userId,
            username: "username@site.com",
            password: "hashed-pwd",
        } as User & Document

        beforeEach(() => {
            jest.clearAllMocks()
        })

        it("should run the done callback with the user id", () => {
            serializeUser(user, done)
            expect(done).toBeCalledWith(null, userId)
        })
    })

    describe("deserializeUser()", () => {
        const userId = "12345"
        const user: User & Document = {
            _id: userId,
            username: "username@site.com",
            password: "hashed-pwd",
        } as User & Document

        beforeEach(() => {
            jest.clearAllMocks()
        })

        it("should run the done callback with an error if user is not found", (done) => {
            UserModel.findById = jest.fn().mockRejectedValue({})
            const error = new Error("Deserialization failed")
            const doneFunc = jest.fn().mockImplementation(() => {
                expect(doneFunc).toBeCalledWith(error)
                done()
            })

            deserializeUser(UserModel, userId, doneFunc)
            expect(UserModel.findById).toBeCalledWith(userId)
        })

        it("should run the done callback with the user if user is not found", (done) => {
            UserModel.findById = jest.fn().mockResolvedValue(user)
            const doneFunc = jest.fn().mockImplementation(() => {
                expect(doneFunc).toBeCalledWith(null, user)
                done()
            })

            deserializeUser(UserModel, userId, doneFunc)
            expect(UserModel.findById).toBeCalledWith(userId)
        })
    })
})
