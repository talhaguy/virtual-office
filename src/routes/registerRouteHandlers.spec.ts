import { Request, Response } from "express"
import {
    onUserSaveSuccess,
    onUserSaveError,
    registerHandler,
} from "./registerRouteHandlers"

describe("registerRouteHandlers", () => {
    const req = ({
        logout: jest.fn(),
        flash: jest.fn(),
        body: {
            username: "user@site.com",
            password: "my-password",
        },
    } as unknown) as Request

    const res = ({
        json: jest.fn(),
        redirect: jest.fn(),
    } as unknown) as Response

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("onUserSaveSuccess()", () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        it("should redirect to login page with flash message", () => {
            onUserSaveSuccess(req, res)
            expect(req.flash).toBeCalledWith(
                "info",
                "Thank you for registering. Please login."
            )
            expect(res.redirect).toBeCalledWith("/login")
        })
    })

    describe("onUserSaveError()", () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        it("should add a specific flash message and redirect to register page on duplicate user error (error code 11000)", () => {
            const error = {
                code: 11000,
            }

            onUserSaveError(req, res, error)

            expect(req.flash).toBeCalledWith("error", "Duplicate user")
            expect(res.redirect).toBeCalledWith("/register")
        })

        it("should add flash message and redirect to register page on general errors", () => {
            const error = {
                code: 12345,
            }

            onUserSaveError(req, res, error)

            expect(req.flash).toBeCalledWith("error", "Server error")
            expect(res.redirect).toBeCalledWith("/register")
        })
    })

    describe("registerHandler()", () => {
        const error = new Error("Save error")
        const onUserSaveSuccess = jest.fn()
        const onUserSaveError = jest.fn()

        beforeEach(() => {
            jest.clearAllMocks()
        })

        it("should run the onUserSaveError function on user model save error", (done) => {
            const save = jest.fn().mockRejectedValue(error)
            const createUser = jest.fn().mockImplementation(() => ({
                save,
            }))
            const onUserSaveError = jest.fn().mockImplementation(() => {
                expect(onUserSaveError).toBeCalledWith(req, res, error)
                done()
            })

            registerHandler(
                createUser,
                onUserSaveSuccess,
                onUserSaveError,
                req,
                res
            )

            expect(createUser).toBeCalledWith({
                username: req.body.username,
                password: req.body.password,
            })
            expect(save).toBeCalled()
        })

        it("should create a new user model, save it, then on success run the onUserSaveSuccess function", (done) => {
            const save = jest.fn().mockResolvedValue({})
            const createUser = jest.fn().mockImplementation(() => ({
                save,
            }))
            const onUserSaveSuccess = jest.fn().mockImplementation(() => {
                expect(onUserSaveSuccess).toBeCalledWith(req, res)
                done()
            })

            registerHandler(
                createUser,
                onUserSaveSuccess,
                onUserSaveError,
                req,
                res
            )

            expect(createUser).toBeCalledWith({
                username: req.body.username,
                password: req.body.password,
            })
            expect(save).toBeCalled()
        })
    })
})
