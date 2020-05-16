import { Document } from "mongoose"
import { database } from "../database/db"
import { Room } from "../models"

export const RoomModel = database.model<Room & Document>(
    "Room",
    new database.Schema({
        id: {
            type: String,
            unique: true,
        },
        name: String,
    })
)
