import { RoomType } from "../../shared-src/constants"

export interface Room {
    id: string
    name: string
    width: number
    roomType: RoomType
}
