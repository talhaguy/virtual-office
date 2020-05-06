import { Document } from "mongoose"
import { User } from "../models"
import { database } from "./db"

export const UserModel = database.model<User & Document>(
    "User",
    new database.Schema({
        username: {
            type: String,
            unique: true,
        },
        password: String,
    })
)
