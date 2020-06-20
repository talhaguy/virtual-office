import { Request, Response } from "express"
import { registrationValidation } from "./registrationValidation"

describe("registrationValidation", () => {
    describe("registrationValidation()", () => {
        const res = ({
            redirect: jest.fn(),
        } as unknown) as Response
        const next = jest.fn()

        beforeEach(() => {
            jest.clearAllMocks()
        })

        it("should add a flash message when username fails validation and redirect to the registration page and NOT run the next function", () => {
            const req = ({
                body: {
                    username: "user", // invalid b/c not an email
                    password: "asdfasdf",
                },
                flash: jest.fn(),
            } as unknown) as Request

            registrationValidation(req, res, next)

            expect(req.flash).toBeCalledWith("error", "Wrong username format")
            expect(res.redirect).toBeCalledWith("/register")
            expect(next).not.toBeCalled()
        })

        it("should add a flash message when password fails validation and redirect to the registration page and NOT run the next function", () => {
            const req = ({
                body: {
                    username: "user@site.com",
                    password: "asdf", // invalid b/c too short
                },
                flash: jest.fn(),
            } as unknown) as Request

            registrationValidation(req, res, next)

            expect(req.flash).toBeCalledWith("error", "Wrong password format")
            expect(res.redirect).toBeCalledWith("/register")
            expect(next).not.toBeCalled()
        })

        it("should add flash messages when username and password both fail validation and redirect to the registration page and NOT run the next function", () => {
            const req = ({
                body: {
                    username: "user", // invalid b/c not an email
                    password: "asdf", // invalid b/c too short
                },
                flash: jest.fn(),
            } as unknown) as Request

            registrationValidation(req, res, next)

            expect(req.flash).toBeCalledTimes(2)

            expect((req.flash as jest.Mock<any, any>).mock.calls[0][0]).toBe(
                "error"
            )
            expect((req.flash as jest.Mock<any, any>).mock.calls[0][1]).toBe(
                "Wrong username format"
            )

            expect((req.flash as jest.Mock<any, any>).mock.calls[1][0]).toBe(
                "error"
            )
            expect((req.flash as jest.Mock<any, any>).mock.calls[1][1]).toBe(
                "Wrong password format"
            )

            expect(res.redirect).toBeCalledWith("/register")

            expect(next).not.toBeCalled()
        })

        it("should run the next function if username and password passes validation", () => {
            const req = ({
                body: {
                    username: "user@site.com",
                    password: "asdfasdf",
                },
                flash: jest.fn(),
            } as unknown) as Request

            registrationValidation(req, res, next)

            expect(next).toBeCalled()
        })
    })
})
