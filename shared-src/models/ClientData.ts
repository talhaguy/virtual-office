import { OnlineUser } from "./OnlineUser"
import { Room } from "../../src/models"

export interface RoomClientData extends Room {
    users: Omit<OnlineUser, "roomId">[]
}

export interface ClientData {
    currentUser: OnlineUser
    onlineUsers: OnlineUser[]
    rooms: RoomClientData[]
}
