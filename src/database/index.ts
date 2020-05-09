import {
    connect as _connect,
    connectionErrorCb as _connectionErrorCb,
    connectionOpenCb as _connectionOpenCb,
} from "./db"
import mongoose, { Mongoose } from "mongoose"

const connectionErrorCb = ((console: Console) => (err: any) =>
    _connectionErrorCb(console, err))(console)

const connectionOpenCb = ((console: Console) => () =>
    _connectionOpenCb(console))(console)

export const connect = ((
    mongoose: Mongoose,
    dbPath: string,
    connectionErrorCb: (err: any) => void,
    connectionOpenCb: () => void
) => {
    return () => {
        return _connect(mongoose, dbPath, connectionErrorCb, connectionOpenCb)
    }
})(mongoose, process.env["DB_PATH"], connectionErrorCb, connectionOpenCb)

export { database } from "./db"
