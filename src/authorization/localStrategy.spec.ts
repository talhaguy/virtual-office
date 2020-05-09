import { mock, instance, verify, resetCalls, when, deepEqual } from "ts-mockito"
import { User } from "../models"
import { Model, Document } from "mongoose"
import { IVerifyOptions } from "passport-local"
import { verifyFunction, serializeUser, deserializeUser } from "./localStrategy"

describe("localStrategy", () => {
    const userModelMock = mock<Model<User & Document, {}>>()
    const userModel = instance(userModelMock)

    beforeEach(() => {
        resetCalls(userModelMock)
    })

    describe("verifyFunction()", () => {
        interface DoneMocks {
            done: (error: any, user?: any, options?: IVerifyOptions) => void
        }
        const doneMocks = mock<DoneMocks>()
        const doneMocksInstance = instance(doneMocks)

        beforeEach(() => {
            resetCalls(doneMocks)
        })

        it("should call a done callback with an error if user is not found", (done) => {
            const username = "some-user-that-doesnt-exist@site.com"

            when(userModelMock.findOne(deepEqual({ username }))).thenReject()
            when(
                doneMocks.done(
                    null,
                    false,
                    deepEqual({
                        message: "User not found",
                    })
                )
            ).thenCall(() => {
                verify(
                    doneMocks.done(
                        null,
                        false,
                        deepEqual({
                            message: "User not found",
                        })
                    )
                ).calledAfter(userModelMock.findOne(deepEqual({ username })))
                done()
            })

            verifyFunction(
                userModel,
                username,
                "asdfasdf",
                doneMocksInstance.done
            )
        })

        it("should call a done callback with an error if user is found but password does not match", (done) => {
            const username = "found-user@site.com"
            const password = "wrong-password"
            const foundUser = {
                username: "found-user@site.com",
                password: "real-password",
            }

            when(userModelMock.findOne(deepEqual({ username }))).thenResolve(
                foundUser as any // resolving a mockito mock instance doesn't work here so resorting to `any`
            )
            when(
                doneMocks.done(
                    null,
                    false,
                    deepEqual({
                        message: "Wong password",
                    })
                )
            ).thenCall(() => {
                verify(
                    doneMocks.done(
                        null,
                        false,
                        deepEqual({
                            message: "Wong password",
                        })
                    )
                ).calledAfter(userModelMock.findOne(deepEqual({ username })))
                done()
            })

            verifyFunction(
                userModel,
                username,
                password,
                doneMocksInstance.done
            )
        })

        it("should call a done callback with a user if user is found and password matches", (done) => {
            const username = "found-user@site.com"
            const password = "real-password"
            const foundUser = {
                username: "found-user@site.com",
                password: "real-password",
            }

            when(userModelMock.findOne(deepEqual({ username }))).thenResolve(
                foundUser as any // resolving a mockito mock instance doesn't work here so resorting to `any`
            )
            when(doneMocks.done(null, foundUser)).thenCall(() => {
                verify(doneMocks.done(null, foundUser)).calledAfter(
                    userModelMock.findOne(deepEqual({ username }))
                )
                done()
            })

            verifyFunction(
                userModel,
                username,
                password,
                doneMocksInstance.done
            )
        })
    })

    describe("serializeUser()", () => {
        const userDocumentMock = mock<User & Document>()
        const userDocumentInstance = instance(userDocumentMock)

        interface CbMocks {
            cb: (err: any, id?: string) => void
        }
        const cbMocks = mock<CbMocks>()
        const cbMocksInstance = instance(cbMocks)

        beforeEach(() => {
            resetCalls(userDocumentMock)
            userDocumentInstance._id = "123456"
            resetCalls(cbMocks)
        })

        it("should run a back with the user id", () => {
            serializeUser(userDocumentInstance, cbMocksInstance.cb)
            verify(cbMocks.cb(null, userDocumentInstance._id))
        })
    })

    describe("deserializeUser()", () => {
        interface CbMocks {
            cb: (err: any, user?: User) => void
        }
        const cbMocks = mock<CbMocks>()
        const cbMocksInstance = instance(cbMocks)

        beforeEach(() => {
            resetCalls(cbMocks)
        })

        it("should return an error to a callback if user cannot be found by id", (done) => {
            when(userModelMock.findById("123456")).thenReject()
            when(
                cbMocks.cb(deepEqual(new Error("Deserialization failed")))
            ).thenCall(() => {
                verify(
                    cbMocks.cb(deepEqual(new Error("Deserialization failed")))
                ).calledAfter(userModelMock.findById("123456"))
                done()
            })

            deserializeUser(userModel, "123456", cbMocksInstance.cb)
        })

        it("should return a user to a callback if user is found by id", (done) => {
            const foundUser = {
                _id: "123456",
                username: "found-user@site.com",
                password: "real-password",
            }

            when(userModelMock.findById("123456")).thenResolve(foundUser as any)
            when(cbMocks.cb(null, deepEqual(foundUser))).thenCall(() => {
                verify(cbMocks.cb(null, deepEqual(foundUser))).calledAfter(
                    userModelMock.findById("123456")
                )
                done()
            })

            deserializeUser(userModel, "123456", cbMocksInstance.cb)
        })
    })
})
