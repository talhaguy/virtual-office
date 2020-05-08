import { indexPageHandler } from "./indexPageRouteHandler"
import { mock, instance, resetCalls, verify } from "ts-mockito"
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

        it("should return the index file from the public folder", () => {
            const pathToIndex = "path/to/index.html"
            indexPageHandler(pathToIndex, request, response)
            verify(responseMock.sendFile(pathToIndex)).once()
        })
    })
})
