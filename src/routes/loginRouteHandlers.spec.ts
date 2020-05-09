import { Request, Response } from "express"
import { mock, instance, resetCalls, verify, when, deepEqual } from "ts-mockito"
import { logoutHandler, isLoggedInHandler } from "./loginRouteHandlers"

describe("loginRouteHandlers", () => {
    const reqMock = mock<Request>()
    const req = instance(reqMock)

    const resMock = mock<Response>()
    const res = instance(resMock)

    beforeEach(() => {
        resetCalls(reqMock)
        resetCalls(resMock)
    })

    describe("logoutHandler()", () => {
        it("should logout the user and redirect to the home page", () => {
            logoutHandler(req, res)
            verify(reqMock.logout()).once()
            verify(resMock.redirect("/")).once()
        })
    })

    describe("isLoggedInHandler()", () => {
        it("should return a json response indicating if a user is logged in or not", () => {
            when(reqMock.isAuthenticated()).thenReturn(true)
            isLoggedInHandler(req, res)
            verify(
                resMock.json(
                    deepEqual({
                        loggedIn: true,
                    })
                )
            ).once()
        })
    })
})
