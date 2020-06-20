import { Request, Response, NextFunction } from "express"
import { notFoundPageHandler } from "./notFoundPageHandler"

describe("notFoundPageHandler", () => {
    describe("notFoundPageHandler()", () => {
        const req = {} as Request
        const res = ({
            status: jest.fn(),
        } as unknown) as Response
        const next: NextFunction = jest.fn()

        beforeEach(() => {
            jest.clearAllMocks()
        })

        it("should return status code 404 and run the next function", () => {
            notFoundPageHandler(req, res, next)

            expect(res.status).toBeCalledWith(404)
            expect(next).toBeCalled()
        })
    })
})
