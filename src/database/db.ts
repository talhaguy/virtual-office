import mongoose, { Mongoose } from "mongoose"

export interface Connect {
    (
        mongoose: Mongoose,
        dbPath: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        connectionErrorCb: (err: any) => void,
        connectionOpenCb: () => void
    ): void
}

export const connect: Connect = (
    mongoose: Mongoose,
    dbPath: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (console: Console, err: any): void
}

export const connectionErrorCb: ConnectionErrorCb = (
    console: Console,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    err: any
) => {
    console.error("Connection error: ", err)
}

export interface ConnectionOpenCb {
    (console: Console): void
}

export const connectionOpenCb: ConnectionOpenCb = (console: Console) => {
    console.log("Connected to DB")
}

export const database = mongoose
