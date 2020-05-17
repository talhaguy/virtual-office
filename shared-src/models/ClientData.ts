import { OnlineUser } from "./OnlineUser"

export interface RoomClientData {
    id: string
    name: string
    users: string[]
}

export interface ClientData {
    onlineUsers: OnlineUser[]
    rooms: RoomClientData[]
}
