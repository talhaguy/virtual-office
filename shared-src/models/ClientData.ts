import { OnlineUser } from "./OnlineUser"
import { Room } from "../../src/models"

export interface RoomClientData extends Room {
    users: string[]
}

export interface ClientData {
    onlineUsers: OnlineUser[]
    rooms: RoomClientData[]
}
