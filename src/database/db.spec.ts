import { connect, connectionErrorCb, connectionOpenCb } from "./db"
import mongoose from "mongoose"
import { mockClearForModuleMock } from "../mocks"

jest.mock("mongoose", () => ({
    connect: jest.fn(),
    connection: {
        on: jest.fn(),
        once: jest.fn(),
    },
}))

describe("db", () => {
    describe("connect()", () => {
        const dbPath = "path/to/db"
        const connectionErrorCb = jest.fn()
        const connectionOpenCb = jest.fn()

        beforeEach(() => {
            mockClearForModuleMock(mongoose)
            mockClearForModuleMock(mongoose.connection)
            connectionErrorCb.mockClear()
            connectionOpenCb.mockClear()
        })

        it("should connect to mongodb through mongoose", () => {
            connect(mongoose, dbPath, connectionErrorCb, connectionOpenCb)
            expect(mongoose.connect).toBeCalledTimes(1)
            expect(mongoose.connect).toBeCalledWith(dbPath, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
        })

        it("should run the error callback if there is a connection error", () => {
            const dbPath = "path/to/db"
            connect(mongoose, dbPath, connectionErrorCb, connectionOpenCb)
            expect(mongoose.connection.on).toBeCalledTimes(1)
            expect(mongoose.connection.on).toBeCalledWith(
                "error",
                connectionErrorCb
            )
        })

        it("should run the open callback if the connection opens", () => {
            const dbPath = "path/to/db"
            connect(mongoose, dbPath, connectionErrorCb, connectionOpenCb)
            expect(mongoose.connection.once).toBeCalledTimes(1)
            expect(mongoose.connection.once).toBeCalledWith(
                "open",
                connectionOpenCb
            )
        })
    })

    describe("connectionErrorCb()", () => {
        it("should log an error to the console", () => {
            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => jest.fn())
            connectionErrorCb(console, "some error")
            expect(consoleErrorSpy).toBeCalledWith(
                "Connection error: ",
                "some error"
            )
        })
    })

    describe("connectionOpenCb()", () => {
        it("should log a message to the console", () => {
            const consoleErrorSpy = jest
                .spyOn(console, "log")
                .mockImplementation(() => jest.fn())
            connectionOpenCb(console)
            expect(consoleErrorSpy).toBeCalledWith("Connected to DB")
        })
    })
})
