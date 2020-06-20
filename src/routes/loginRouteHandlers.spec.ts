import { logoutHandler, isLoggedInHandler } from "./loginRouteHandlers"
import { Response, Request } from "express"

describe("logoutRouteHandlers", () => {
    const req = ({
        logout: jest.fn(),
    } as unknown) as Request

    const res = ({
        json: jest.fn(),
        redirect: jest.fn(),
    } as unknown) as Response

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("logoutHandler()", () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        it("should log the user out and redirect to the root page", () => {
            logoutHandler(req, res)
            expect(req.logout).toBeCalled()
            expect(res.redirect).toBeCalledWith("/")
        })
    })

    describe("isLoggedInHandler()", () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        it("should send json data back indicating logged in status", () => {
            let req = ({
                logout: jest.fn(),
                isAuthenticated: jest.fn().mockReturnValue(true),
            } as unknown) as Request

            isLoggedInHandler(req, res)

            expect(res.json).toBeCalledWith({
                loggedIn: true,
            })

            jest.clearAllMocks()

            req = ({
                logout: jest.fn(),
                isAuthenticated: jest.fn().mockReturnValue(false),
            } as unknown) as Request

            isLoggedInHandler(req, res)

            expect(res.json).toBeCalledWith({
                loggedIn: false,
            })
        })
    })
})
