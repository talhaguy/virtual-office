import { Document } from "mongoose"
import { OnlineUserData, User } from "../models"
import { OnlineUser, RoomClientData, ClientData } from "../../shared-src/models"
import { UserModel, RoomModel } from "../databaseModels"

const onlineUsers: OnlineUserData = {}

export function addOnlineUser(key: string, onlineUserData: OnlineUser) {
    onlineUsers[key] = {
        username: onlineUserData.username,
        roomId: onlineUserData.roomId,
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
    return Object.values(onlineUsers).reduce<{ [key: string]: string[] }>(
        (accum, user) => {
            const room = accum[user.roomId]
            if (room) {
                room.push(user.username)
            } else {
                accum[user.roomId] = [user.username]
            }
            return accum
        },
        {}
    )
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
                        width: room.width,
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
