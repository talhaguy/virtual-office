import { Document } from "mongoose"
import { OnlineUserData, User } from "../models"
import {
    OnlineUser,
    RoomClientData,
    ClientData,
    UserColor,
} from "../../shared-src/models"
import { UserModel, RoomModel } from "../databaseModels"

const userColors = [
    UserColor.Red,
    UserColor.Orange,
    UserColor.Blue,
    UserColor.Yellow,
    UserColor.Green,
    UserColor.Purple,
    UserColor.Cyan,
    UserColor.SkyBlue,
]

let userColorIndex = -1

export function getNextUserColor() {
    if (userColorIndex === userColors.length - 1) {
        userColorIndex = 0
    } else {
        userColorIndex += 1
    }

    return userColors[userColorIndex]
}

const onlineUsers: OnlineUserData = {}

export function addOnlineUser(
    key: string,
    onlineUserData: Omit<OnlineUser, "color">
) {
    onlineUsers[key] = {
        username: onlineUserData.username,
        roomId: onlineUserData.roomId,
        color: getNextUserColor(),
    }
}

export function getDataForUser(userId: string) {
    return onlineUsers[userId]
}

export function updateUserRoom(key: string, roomId: string) {
    onlineUsers[key].roomId = roomId
}

export function removeOnlineUser(key: string) {
    delete onlineUsers[key]
}

export function getOnlineUsers() {
    return onlineUsers
}

export function getOnlineUsersList() {
    return Object.values(onlineUsers)
}

function getUserRoomsMap() {
    return Object.values(onlineUsers).reduce<{
        [key: string]: Omit<OnlineUser, "roomId">[]
    }>((accum, user) => {
        const room = accum[user.roomId]
        const userValue = {
            username: user.username,
            color: user.color,
        }
        if (room) {
            room.push(userValue)
        } else {
            accum[user.roomId] = [userValue]
        }
        return accum
    }, {})
}

export function constructClientData(userId: string) {
    return new Promise<ClientData>((res, rej) => {
        RoomModel.find()
            .then((rooms) => {
                const onlineUsers = getOnlineUsersList()
                const userRoomsMap = getUserRoomsMap()
                const roomData: RoomClientData[] = rooms.map((room) => {
                    return {
                        id: room.id,
                        name: room.name,
                        users: userRoomsMap[room.id]
                            ? userRoomsMap[room.id]
                            : [],
                        gridColStart: room.gridColStart,
                        gridColEnd: room.gridColEnd,
                        gridRowStart: room.gridRowStart,
                        gridRowEnd: room.gridRowEnd,
                        doors: room.doors,
                        roomType: room.roomType,
                    }
                })
                const currentUser = getDataForUser(userId)

                res({
                    currentUser,
                    onlineUsers,
                    rooms: roomData,
                })
            })
            .catch((err) => {
                rej(err)
            })
    })
}

export function deserializeUser(id: string) {
    return new Promise<User & Document>((res, rej) => {
        UserModel.findById(id)
            .then((user) => {
                res(user)
            })
            .catch(() => {
                rej(new Error("Deserialization failed"))
            })
    })
}
