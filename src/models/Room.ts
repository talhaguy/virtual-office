import { RoomType } from "../../shared-src/constants"
import { DoorSide, RoomTitlePosition } from "../../shared-src/models"

export interface Door {
    side: DoorSide
    position: number
}

export interface Room {
    id: string
    name: string
    gridColStart: number
    gridColEnd: number
    gridRowStart: number
    gridRowEnd: number
    doors: Door[]
    titlePosition: RoomTitlePosition
    roomType: RoomType
}
