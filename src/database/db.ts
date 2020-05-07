import mongoose, { Mongoose } from "mongoose"
import { Logger } from "../models/Logger"

export interface Connect {
    (
        mongoose: Mongoose,
        dbPath: string,
        connectionErrorCb: (err: any) => void,
        connectionOpenCb: () => void
    ): void
}

export const connect: Connect = (
    mongoose: Mongoose,
    dbPath: string,
    connectionErrorCb: (err: any) => void,
    connectionOpenCb: () => void
) => {
    mongoose.connect(dbPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    const db = mongoose.connection

    db.on("error", connectionErrorCb)

    db.once("open", connectionOpenCb)
}

export interface ConnectionErrorCb {
    (logger: Logger, err: any): void
}

export const connectionErrorCb: ConnectionErrorCb = (
    logger: Logger,
    err: any
) => {
    logger.error("Connection error: ", err)
}

export interface ConnectionOpenCb {
    (logger: Logger): void
}

export const connectionOpenCb: ConnectionOpenCb = (logger: Logger) => {
    logger.log("Connected to DB")
}

export const database = mongoose
