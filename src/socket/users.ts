import { Document } from "mongoose"
import { OnlineUserData, User } from "../models"
import { OnlineUser } from "../../shared-src/models"
import { UserModel } from "../databaseModels"

const onlineUsers: OnlineUserData = {}

export function addOnlineUser(key: string, onlineUserData: OnlineUser) {
    onlineUsers[key] = {
        username: onlineUserData.username,
        roomId: onlineUserData.roomId,
    }
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
