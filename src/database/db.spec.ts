import mongoose from "mongoose"
import { connect, connectionErrorCb, connectionOpenCb } from "./db"

jest.mock("mongoose", () => ({
    connect: jest.fn(),
    connection: {
        on: jest.fn(),
        once: jest.fn(),
    },
}))

describe("db", () => {
    jest.spyOn(console, "log").mockImplementation(() => {
        return
    })
    jest.spyOn(console, "error").mockImplementation(() => {
        return
    })

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("connect()", () => {
        const dbPath = "/path/to/db"
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }

        beforeEach(() => {
            jest.clearAllMocks()
        })

        it("should connect to db using mongoose and set error and open callbacks", () => {
            const connectionErrorCb = jest.fn()
            const connectionOpenCb = jest.fn()

            connect(mongoose, dbPath, connectionErrorCb, connectionOpenCb)

            expect(mongoose.connect).toBeCalledWith(dbPath, options)
            expect(mongoose.connection.on).toBeCalledWith(
                "error",
                connectionErrorCb
            )
            expect(mongoose.connection.once).toBeCalledWith(
                "open",
                connectionOpenCb
            )
        })
    })

    describe("connectionErrorCb()", () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        it("should print an error to the console", () => {
            const error = new Error("some error")
            connectionErrorCb(console, error)
            expect(console.error).toBeCalledWith("Connection error: ", error)
        })
    })

    describe("connectionOpenCb()", () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        it("should print an message to the console", () => {
            connectionOpenCb(console)
            expect(console.log).toBeCalledWith("Connected to DB")
        })
    })
})
