import { RoomType } from "../../shared-src/constants"

export interface Room {
    id: string
    name: string
    gridColStart: number
    gridColEnd: number
    gridRowStart: number
    gridRowEnd: number
    roomType: RoomType
}
