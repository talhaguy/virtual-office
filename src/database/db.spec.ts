import { connect, connectionErrorCb, connectionOpenCb } from "./db"
import { Mongoose, Connection } from "mongoose"
import { mock, resetCalls, instance, verify, deepEqual } from "ts-mockito"

describe("db", () => {
    describe("connect()", () => {
        const mongooseMock = mock<Mongoose>()
        const mongooseInstance = instance(mongooseMock)

        const connectionMock = mock<Connection>()
        const connectionInstance = instance(connectionMock)

        const dbPath = "path/to/db"
        const connectionErrorCb = jest.fn()
        const connectionOpenCb = jest.fn()

        beforeEach(() => {
            resetCalls(mongooseMock)
            resetCalls(connectionMock)
            mongooseInstance.connection = connectionInstance
            connectionErrorCb.mockClear()
            connectionOpenCb.mockClear()
        })

        it("should connect to mongodb through mongoose", () => {
            connect(
                mongooseInstance,
                dbPath,
                connectionErrorCb,
                connectionOpenCb
            )
            verify(
                mongooseMock.connect(
                    dbPath,
                    deepEqual({
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                    })
                )
            ).once()
        })

        it("should run the error callback if there is a connection error", () => {
            const dbPath = "path/to/db"
            connect(
                mongooseInstance,
                dbPath,
                connectionErrorCb,
                connectionOpenCb
            )
            verify(connectionMock.on("error", connectionErrorCb)).once()
        })

        it("should run the open callback if the connection opens", () => {
            const dbPath = "path/to/db"
            connect(
                mongooseInstance,
                dbPath,
                connectionErrorCb,
                connectionOpenCb
            )
            verify(connectionMock.once("open", connectionOpenCb)).once()
        })
    })

    describe("connectionErrorCb()", () => {
        const consoleMock = mock<Console>()
        const consoleInstance = instance(consoleMock)

        beforeEach(() => {
            resetCalls(consoleMock)
        })

        it("should log an error to the console", () => {
            connectionErrorCb(consoleInstance, "some error")
            verify(consoleMock.error("Connection error: ", "some error")).once()
        })
    })

    describe("connectionOpenCb()", () => {
        const consoleMock = mock<Console>()
        const consoleInstance = instance(consoleMock)

        beforeEach(() => {
            resetCalls(consoleMock)
        })

        it("should log a message to the console", () => {
            connectionOpenCb(consoleInstance)
            verify(consoleMock.log("Connected to DB")).once()
        })
    })
})
