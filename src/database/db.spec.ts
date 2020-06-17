import mongoose from "mongoose"
import { connect } from "./db"

jest.mock("mongoose", () => ({
    connect: jest.fn(),
    connection: {
        on: jest.fn(),
        once: jest.fn(),
    },
}))

describe("db", () => {
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

        fit("should connect to db using mongoose and set error and open callbacks", () => {
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
})
