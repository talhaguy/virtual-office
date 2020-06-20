import { Document, Model } from "mongoose"
import { OnlineUserData, User, Room } from "../models"
import { OnlineUser, RoomClientData, ClientData } from "../../shared-src/models"
import { userColorsList } from "./constants"

// MARK: State

export interface State {
    currentIndex: number
    onlineUsersMap: OnlineUserData
}

// MARK: addOnlineUser()

function incrementUserColorIndex(state: State) {
    state.currentIndex =
        state.currentIndex >= userColorsList.length - 1
            ? 0
            : state.currentIndex + 1
}

function getNextUserColor(state: State) {
    return userColorsList[state.currentIndex]
}

export function addOnlineUser(
    state: State,
    key: string,
    onlineUserData: Omit<OnlineUser, "color">
) {
    incrementUserColorIndex(state)

    state.onlineUsersMap[key] = {
        username: onlineUserData.username,
        roomId: onlineUserData.roomId,
        color: getNextUserColor(state),
    }
}

// MARK: getDataForUser()

export interface GetDataForUserFunction {
    (state: State, userId: string): OnlineUser
}

export function getDataForUser(state: State, userId: string) {
    return state.onlineUsersMap[userId]
}

// MARK: updateUserRoom()

export function updateUserRoom(state: State, key: string, roomId: string) {
    state.onlineUsersMap[key].roomId = roomId
}

// MARK: removeOnlineUser()

export function removeOnlineUser(state: State, key: string) {
    delete state.onlineUsersMap[key]
}

// MARK: getOnlineUsers()

export function getOnlineUsers(state: State) {
    return state.onlineUsersMap
}

// MARK: constructClientData()

function getOnlineUsersList(state: State) {
    return Object.values(state.onlineUsersMap)
}

function getUserRoomsMap(state: State) {
    return Object.values(state.onlineUsersMap).reduce<{
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

export function constructClientData(
    state: State,
    getDataForUser: GetDataForUserFunction,
    RoomModel: Model<Room & Document, {}>,
    userId: string
) {
    return new Promise<ClientData>((res, rej) => {
        RoomModel.find()
            .then((rooms) => {
                const onlineUsers = getOnlineUsersList(state)
                const userRoomsMap = getUserRoomsMap(state)
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
                        titlePosition: room.titlePosition,
                        roomType: room.roomType,
                    }
                })
                const currentUser = getDataForUser(state, userId)

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

// MARK: deserializeUser()

export function deserializeUser(
    UserModel: Model<User & Document, {}>,
    id: string
) {
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
