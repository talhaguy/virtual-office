import { Mongoose } from "mongoose"
import { Connect, ConnectionErrorCb, ConnectionOpenCb } from "./db"

export function connectFactory(
    connect: Connect,
    mongoose: Mongoose,
    dbPath: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    connectionErrorCb: (err: any) => void,
    connectionOpenCb: () => void
) {
    return () => {
        return connect(mongoose, dbPath, connectionErrorCb, connectionOpenCb)
    }
}

export function connectionErrorCbFactory(
    connectionErrorCb: ConnectionErrorCb,
    console: Console
) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (err: any) => {
        return connectionErrorCb(console, err)
    }
}

export function connectionOpenCbFactory(
    connectionOpenCb: ConnectionOpenCb,
    console: Console
) {
    return () => {
        return connectionOpenCb(console)
    }
}
