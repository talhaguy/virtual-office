import {
    connectFactory,
    connectionErrorCbFactory,
    connectionOpenCbFactory,
} from "./db.factory"
import { Mongoose } from "mongoose"
import { mock, resetCalls, instance, verify } from "ts-mockito"
import { Connect, ConnectionErrorCb, ConnectionOpenCb } from "./db"

describe("db.factory", () => {
    const mongooseMock = mock<Mongoose>()
    const mongooseInstance = instance(mongooseMock)

    beforeEach(() => {
        resetCalls(mongooseMock)
    })

    describe("connectFactory()", () => {
        it("should create factory with dependencies", () => {
            interface ConnectContainerForMock {
                connect: Connect
            }
            const connectContainerMock = mock<ConnectContainerForMock>()
            const connectContainerInstance = instance(connectContainerMock)

            const dbPath = "some/path/to/db"
            const connectionErrorCb = jest.fn()
            const connectionOpenCb = jest.fn()
            const createdConnect = connectFactory(
                connectContainerInstance.connect,
                mongooseInstance,
                dbPath,
                connectionErrorCb,
                connectionOpenCb
            )
            createdConnect()
            verify(
                connectContainerMock.connect(
                    mongooseInstance,
                    dbPath,
                    connectionErrorCb,
                    connectionOpenCb
                )
            ).once()
        })
    })

    describe("connectionErrorCbFactory()", () => {
        const consoleMock = mock<Console>()
        const consoleInstance = instance(consoleMock)

        beforeEach(() => {
            resetCalls(consoleMock)
        })

        it("should create factory with dependencies", () => {
            interface ConnectionErrorCbMockContainer {
                connectionErrorCb: ConnectionErrorCb
            }
            const connectionErrorCbMockContainer = mock<
                ConnectionErrorCbMockContainer
            >()
            const connectionErrorCbMockContainerInstance = instance(
                connectionErrorCbMockContainer
            )

            const createdConnectionErrorCb = connectionErrorCbFactory(
                connectionErrorCbMockContainerInstance.connectionErrorCb,
                consoleInstance
            )
            const error = "some error"
            createdConnectionErrorCb(error)

            verify(
                connectionErrorCbMockContainer.connectionErrorCb(
                    consoleInstance,
                    error
                )
            ).once()
        })
    })

    describe("connectionOpenCbFactory()", () => {
        const consoleMock = mock<Console>()
        const consoleInstance = instance(consoleMock)

        beforeEach(() => {
            resetCalls(consoleMock)
        })

        it("should create factory with dependencies", () => {
            interface ConnectionOpenCbMockContainer {
                connectionOpenCb: ConnectionOpenCb
            }
            const connectionOpenCbMockContainer = mock<
                ConnectionOpenCbMockContainer
            >()
            const connectionOpenCbMockContainerInstance = instance(
                connectionOpenCbMockContainer
            )

            const createdConnectionOpenCb = connectionOpenCbFactory(
                connectionOpenCbMockContainerInstance.connectionOpenCb,
                consoleInstance
            )
            createdConnectionOpenCb()

            verify(
                connectionOpenCbMockContainer.connectionOpenCb(consoleInstance)
            ).once()
        })
    })
})
