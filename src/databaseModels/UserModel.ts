import { Document } from "mongoose"
import { User } from "../models"
import { database } from "../database/db"

export const UserModel = database.model<User & Document>(
    "User",
    new database.Schema({
        username: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    })
)
