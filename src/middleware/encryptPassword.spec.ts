import { encryptPassword, encryptPasswordFail } from "./encryptPassword"
import { Request, Response, NextFunction } from "express"

describe("encryptPassword", () => {
    const userEnteredPassword = "plain-text-pwd"
    const hashedPassword = "asdf-1234-lkjh"
    const req: Request = ({
        body: {
            password: userEnteredPassword,
        },
        flash: jest.fn(),
    } as unknown) as Request
    const res: Response = ({
        redirect: jest.fn(),
    } as unknown) as Response

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("encryptPassword()", () => {
        const saltRounds = 10

        beforeEach(() => {
            jest.clearAllMocks()
        })

        it("should run encryptPasswordFailFunction if password hashing fails and should NOT run the next function", (done) => {
            const next: NextFunction = jest.fn()
            const hash = jest.fn().mockRejectedValue({})
            const encryptPasswordFailFunction = jest
                .fn()
                .mockImplementation(() => {
                    expect(next).not.toBeCalled()
                    expect(encryptPasswordFailFunction).toHaveBeenCalledWith(
                        req,
                        res
                    )
                    done()
                })

            encryptPassword(hash, encryptPasswordFailFunction, req, res, next)
            expect(hash).toBeCalledWith(userEnteredPassword, saltRounds)
        })

        it("should use the supplied hash function to set the request password as hashed on successful hashing", (done) => {
            const hash = jest.fn().mockResolvedValue(hashedPassword)
            const encryptPasswordFailFunction = jest.fn()
            const next: NextFunction = jest.fn().mockImplementation(() => {
                expect(req.body.password).toBe(hashedPassword)
                done()
            })

            encryptPassword(hash, encryptPasswordFailFunction, req, res, next)
            expect(hash).toBeCalledWith(userEnteredPassword, saltRounds)
        })
    })

    describe("encryptPasswordFail()", () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        it("should redirect to register page with a flash message", () => {
            encryptPasswordFail(req, res)
            expect(req.flash).toBeCalledWith("error", "Something went wrong")
            expect(res.redirect).toBeCalledWith("/register")
        })
    })
})
