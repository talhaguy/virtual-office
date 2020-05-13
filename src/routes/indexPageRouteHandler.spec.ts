import { indexPageHandler } from "./indexPageRouteHandler"
import { mock, instance, resetCalls, verify, deepEqual } from "ts-mockito"
import { Response, Request } from "express"

describe("indexPageRouteHandler", () => {
    describe("indexPageHandler()", () => {
        const requestMock = mock<Request>()
        const request = instance(requestMock)
        const responseMock = mock<Response>()
        const response = instance(responseMock)

        beforeEach(() => {
            resetCalls(requestMock)
            resetCalls(responseMock)
        })

        it("should render the index view file with the initial client data", () => {
            // send no data if user is not logged in
            let expectedInitialClientData = {}
            indexPageHandler(request, response)
            verify(
                responseMock.render(
                    "index",
                    deepEqual(expectedInitialClientData)
                )
            ).once()

            // send username if user is logged in
            resetCalls(responseMock)
            request.user = {
                username: "yuna@spira.com",
            }
            expectedInitialClientData = {
                username: "yuna@spira.com",
            }
            indexPageHandler(request, response)
            verify(
                responseMock.render(
                    "index",
                    deepEqual(expectedInitialClientData)
                )
            )
        })
    })
})
