import {
    connectFactory,
    connectionErrorCbFactory,
    connectionOpenCbFactory,
} from "./db.factory"
import mongoose from "mongoose"
import { loggerMock, resetLoggerMock, mockClearForModuleMock } from "../mocks"

jest.mock("mongoose")

describe("db.factory", () => {
    beforeEach(() => {
        mockClearForModuleMock(mongoose)
    })

    describe("connectFactory()", () => {
        it("should create factory with dependencies", () => {
            const connect = jest.fn()
            const dbPath = "some/path/to/db"
            const connectionErrorCb = jest.fn()
            const connectionOpenCb = jest.fn()
            const createdConnect = connectFactory(
                connect,
                mongoose,
                dbPath,
                connectionErrorCb,
                connectionOpenCb
            )
            createdConnect()
            expect(connect).toBeCalledWith(
                mongoose,
                dbPath,
                connectionErrorCb,
                connectionOpenCb
            )
        })
    })

    describe("connectionErrorCbFactory()", () => {
        beforeEach(() => {
            resetLoggerMock()
        })

        it("should create factory with dependencies", () => {
            const connectionErrorCb = jest.fn()
            const createdConnectionErrorCb = connectionErrorCbFactory(
                connectionErrorCb,
                loggerMock
            )
            const error = "some error"
            createdConnectionErrorCb(error)
            expect(connectionErrorCb).toBeCalledWith(loggerMock, error)
        })
    })

    describe("connectionOpenCbFactory()", () => {
        beforeEach(() => {
            resetLoggerMock()
        })

        it("should create factory with dependencies", () => {
            const connectionOpenCb = jest.fn()
            const createdConnectionOpenCb = connectionOpenCbFactory(
                connectionOpenCb,
                loggerMock
            )
            createdConnectionOpenCb()
            expect(connectionOpenCb).toBeCalledWith(loggerMock)
        })
    })
})
