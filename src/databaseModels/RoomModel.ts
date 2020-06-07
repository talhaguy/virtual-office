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
        gridColStart: {
            type: Number,
            required: true,
        },
        gridColEnd: {
            type: Number,
            required: true,
        },
        gridRowStart: {
            type: Number,
            required: true,
        },
        gridRowEnd: {
            type: Number,
            required: true,
        },
        roomType: {
            type: String,
            enum: [
                RoomType.Desks,
                RoomType.MeetingRoom,
                RoomType.Break,
                RoomType.QuietRoom,
            ],
            required: true,
        },
    })
)
