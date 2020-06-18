import { indexPageHandler } from "./indexPageRouteHandler"
import { Response, Request } from "express"

describe("indexPageRouteHandler", () => {
    describe("indexPageHandler()", () => {
        const username = "user@site.com"

        const req = ({
            user: {
                username,
            },
            flash: jest.fn().mockImplementation(() => ({
                someKey: ["First message", "Second Message"],
            })),
        } as unknown) as Request

        const res = ({
            render: jest.fn(),
        } as unknown) as Response

        beforeEach(() => {
            jest.clearAllMocks()
        })

        it("should render the index view file with the initial client data", () => {
            indexPageHandler(req, res)
            expect(res.render).toBeCalledWith("index", {
                username,
                flashMessages: {
                    someKey: ["First message", "Second Message"],
                },
            })
        })
    })
})
