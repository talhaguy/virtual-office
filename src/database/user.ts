import { Document } from "mongoose"
import { User } from "../models/User"
import { database } from "./db"

export const UserModel = database.model<User & Document>(
    "User",
    new database.Schema({
        name: String,
    })
)
