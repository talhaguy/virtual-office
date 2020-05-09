import { Request, Response } from "express"
import { Document } from "mongoose"
import { mock, instance, resetCalls, verify, when, deepEqual } from "ts-mockito"
import {
    onUserSaveSuccess,
    onUserSaveError,
    registerHandler,
} from "./registerRouteHandlers"
import { UserModel } from "../databaseModels"
import { User } from "../models"

describe("registerRouteHandlers", () => {
    const reqMock = mock<Request>()
    const req = instance(reqMock)
    req.body = {
        username: "obiwan@jedi.com",
        password: "123456789",
    }

    const resMock = mock<Response>()
    const res = instance(resMock)

    const userModelMock = mock<User & Document>(UserModel)
    const userModelInstance = instance(userModelMock)

    beforeEach(() => {
        resetCalls(reqMock)
        resetCalls(resMock)
        resetCalls(userModelMock)
    })

    describe("onUserSaveSuccess()", () => {
        it("should redirect to login page", () => {
            onUserSaveSuccess(res)
            verify(resMock.redirect("/login")).once()
        })
    })

    describe("onUserSaveError()", () => {
        it("should return a 400 status and send an error response on duplicate user error", () => {
            when(resMock.status(400)).thenReturn(res)

            const err = { code: 11000 }
            onUserSaveError(res, err)
            verify(resMock.status(400)).once()
            verify(
                resMock.send(
                    deepEqual({
                        status: "ERROR",
                        message: "Duplicate user",
                    })
                )
            ).once()
        })

        it("should return a 500 status and send an error response on any other error", () => {
            when(resMock.status(500)).thenReturn(res)

            const err = { code: 12345 }
            onUserSaveError(res, err)
            verify(resMock.status(500)).once()
            verify(
                resMock.send(
                    deepEqual({
                        status: "ERROR",
                        message: "Server error",
                    })
                )
            ).once()
        })
    })

    describe("registerHandler()", () => {
        const createUser = jest.fn().mockImplementation(() => userModelInstance)

        interface UserCbMocks {
            onUserSaveSuccess: (res: Response) => void
            onUserSaveError: (res: Response, err: any) => void
        }
        const userCbMocks = mock<UserCbMocks>()
        const userCbMocksInstance = instance(userCbMocks)

        beforeEach(() => {
            createUser.mockClear()
            resetCalls(userCbMocks)
        })

        it("should create a new user model, save it, then on success run the onUserSaveSuccess function", (done) => {
            when(userModelMock.save()).thenResolve()
            when(userCbMocks.onUserSaveSuccess(res)).thenCall(() => {
                verify(userCbMocks.onUserSaveSuccess(res)).calledAfter(
                    userModelMock.save()
                )
                done()
            })

            registerHandler(
                createUser,
                userCbMocksInstance.onUserSaveSuccess,
                userCbMocksInstance.onUserSaveError,
                req,
                res
            )

            expect(createUser).toHaveBeenCalledWith({
                username: "obiwan@jedi.com",
                password: "123456789",
            })
            verify(userModelMock.save()).once()
        })

        it("should run the onUserSaveError function on user model save error", (done) => {
            const error = { code: 11000 }
            when(userModelMock.save()).thenReturn(Promise.reject(error))
            when(userCbMocks.onUserSaveError(res, error)).thenCall(() => {
                verify(userCbMocks.onUserSaveError(res, error)).calledAfter(
                    userModelMock.save()
                )
                done()
            })

            registerHandler(
                createUser,
                userCbMocksInstance.onUserSaveSuccess,
                userCbMocksInstance.onUserSaveError,
                req,
                res
            )

            verify(userModelMock.save()).once()
        })
    })
})
