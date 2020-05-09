import { mock, instance, verify, resetCalls, when, deepEqual } from "ts-mockito"
import { User } from "../models"
import { Model, Document } from "mongoose"
import { IVerifyOptions } from "passport-local"
import { verifyFunction } from "./localStrategy"

describe("localStrategy", () => {
    const userModelMock = mock<Model<User & Document, {}>>()
    const userModel = instance(userModelMock)

    interface DoneMocks {
        done: (error: any, user?: any, options?: IVerifyOptions) => void
    }
    const doneMocks = mock<DoneMocks>()
    const doneMocksInstance = instance(doneMocks)

    beforeEach(() => {
        resetCalls(userModelMock)
        resetCalls(doneMocks)
    })

    describe("verifyFunction()", () => {
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
                foundUser as any
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
                foundUser as any
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
})
