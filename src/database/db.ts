import mongoose, { Mongoose } from "mongoose"

// MARK: connect()

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

// MARK: connectionErrorCb()

export interface ConnectionErrorCb {
    (console: Console, err: any): void
}

export const connectionErrorCb: ConnectionErrorCb = (
    console: Console,
    err: any
) => {
    console.error("Connection error: ", err)
}

// MARK: connectionOpenCb()

export interface ConnectionOpenCb {
    (console: Console): void
}

export const connectionOpenCb: ConnectionOpenCb = (console: Console) => {
    console.log("Connected to DB")
}

export const database = mongoose
