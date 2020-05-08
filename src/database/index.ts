import {
    connectFactory,
    connectionErrorCbFactory,
    connectionOpenCbFactory,
} from "./db.factory"
import {
    connect as _connect,
    connectionErrorCb as _connectionErrorCb,
    connectionOpenCb as _connectionOpenCb,
} from "./db"
import mongoose from "mongoose"

const connectionErrorCb = connectionErrorCbFactory(_connectionErrorCb, console)
const connectionOpenCb = connectionOpenCbFactory(_connectionOpenCb, console)

export const connect = connectFactory(
    _connect,
    mongoose,
    process.env["DB_PATH"],
    connectionErrorCb,
    connectionOpenCb
)

export { database } from "./db"
