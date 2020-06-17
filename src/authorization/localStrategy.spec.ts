import { verifyFunction, ErrorMessages } from "./localStrategy"
import { compare } from "bcrypt"
import { UserModel } from "../databaseModels"

jest.mock("bcrypt")
jest.mock("../databaseModels")

describe("localStrategy", () => {
    describe("verifyFunction", () => {
        const username = "username@site.com"
        const password = "plain-text-pwd"
        const doneFunc = jest.fn()
        const verifyFunctionNoUserFound = jest.fn()
        const verifyFunctionUserFound = jest.fn()

        beforeEach(() => {
            doneFunc.mockClear()
            verifyFunctionNoUserFound.mockClear()
            verifyFunctionUserFound.mockClear()
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
})
