import { Document } from "mongoose"
import { database } from "../database/db"
import { Room } from "../models"
import { RoomType } from "../../shared-src/constants"

export const RoomModel = database.model<Room & Document>(
    "Room",
    new database.Schema({
        id: {
            type: String,
            unique: true,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        width: {
            type: Number,
            required: true,
        },
        roomType: {
            type: String,
            enum: [RoomType.Desks, RoomType.MeetingRoom, RoomType.Break],
            required: true,
        },
    })
)
