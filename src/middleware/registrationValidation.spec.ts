import { Request, Response } from "express"
import { mock, instance, resetCalls, verify, when, deepEqual } from "ts-mockito"
import { registrationValidation } from "./registrationValidation"

describe("registrationValidation", () => {
    const reqMock = mock<Request>()
    const req = instance(reqMock)

    const resMock = mock<Response>()
    const res = instance(resMock)

    const next = jest.fn()

    function clearMocks() {
        resetCalls(reqMock)
        when(resMock.status(401)).thenReturn(res)
        resetCalls(resMock)
        next.mockClear()
    }

    beforeEach(() => {
        clearMocks()
    })

    describe("registrationValidation()", () => {
        it("should return a 401 status and an error payload on empty password or empty username", () => {
            // both username and password blank

            req.body = {
                username: "",
                password: "",
            }

            registrationValidation(req, res, next)

            let expectedResponse = {
                status: "ERROR",
                message: "Empty username. Empty password.",
            }
            verify(resMock.status(401)).once()
            verify(resMock.send(deepEqual(expectedResponse))).once()
            expect(next).toBeCalledTimes(0)

            // only username blank

            clearMocks()

            req.body = {
                username: "",
                password: "asdf",
            }

            registrationValidation(req, res, next)

            expectedResponse = {
                status: "ERROR",
                message: "Empty username. ",
            }
            verify(resMock.status(401)).once()
            verify(resMock.send(deepEqual(expectedResponse))).once()
            expect(next).toBeCalledTimes(0)

            // only password blank

            clearMocks()

            req.body = {
                username: "asdf",
                password: "",
            }

            registrationValidation(req, res, next)

            expectedResponse = {
                status: "ERROR",
                message: "Empty password.",
            }
            verify(resMock.status(401)).once()
            verify(resMock.send(deepEqual(expectedResponse))).once()
            expect(next).toBeCalledTimes(0)
        })

        it("should send a 401 error and error response on invalid username or password", () => {
            // both wrong format

            req.body = {
                username: "asdf",
                password: "asdf",
            }
            registrationValidation(req, res, next)
            let expectedResponse = {
                status: "ERROR",
                message: "Wrong username format. Wrong password format.",
            }
            verify(resMock.status(401)).once()
            verify(resMock.send(deepEqual(expectedResponse))).once()
            expect(next).toBeCalledTimes(0)

            // username bad format

            clearMocks()

            req.body = {
                username: "asdf",
                password: "asdfasdf",
            }
            registrationValidation(req, res, next)
            expectedResponse = {
                status: "ERROR",
                message: "Wrong username format. ",
            }
            verify(resMock.status(401)).once()
            verify(resMock.send(deepEqual(expectedResponse))).once()
            expect(next).toBeCalledTimes(0)

            // password bad format

            clearMocks()

            req.body = {
                username: "a@a.com",
                password: "a s d f",
            }
            registrationValidation(req, res, next)
            expectedResponse = {
                status: "ERROR",
                message: "Wrong password format.",
            }
            verify(resMock.status(401)).once()
            verify(resMock.send(deepEqual(expectedResponse))).once()
            expect(next).toBeCalledTimes(0)
        })

        it("should call the next function when validations pass", () => {
            req.body = {
                username: "asdf@asdf.com",
                password: "123456",
            }
            registrationValidation(req, res, next)
            expect(next).toBeCalledTimes(1)
        })
    })
})
