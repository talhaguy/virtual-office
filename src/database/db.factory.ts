import { Mongoose } from "mongoose"
import { Connect, ConnectionErrorCb, ConnectionOpenCb } from "./db"
import { Logger } from "../models/Logger"

export function connectFactory(
    connect: Connect,
    mongoose: Mongoose,
    dbPath: string,
    connectionErrorCb: (err: any) => void,
    connectionOpenCb: () => void
) {
    return () => {
        return connect(mongoose, dbPath, connectionErrorCb, connectionOpenCb)
    }
}

export function connectionErrorCbFactory(
    connectionErrorCb: ConnectionErrorCb,
    logger: Logger
) {
    return (err: any) => {
        return connectionErrorCb(logger, err)
    }
}

export function connectionOpenCbFactory(
    connectionOpenCb: ConnectionOpenCb,
    logger: Logger
) {
    return () => {
        return connectionOpenCb(logger)
    }
}
