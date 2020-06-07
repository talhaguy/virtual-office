import { RoomType } from "../../shared-src/constants"
import { DoorSide } from "../../shared-src/models"

export interface Door {
    doorSide: DoorSide
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
    roomType: RoomType
}
