import { Model, Document } from "mongoose"
import {
    State,
    GetDataForUserFunction,
    addOnlineUser as _addOnlineUser,
    getDataForUser as _getDataForUser,
    updateUserRoom as _updateUserRoom,
    removeOnlineUser as _removeOnlineUser,
    getOnlineUsers as _getOnlineUsers,
    constructClientData as _constructClientData,
    deserializeUser as _deserializeUser,
} from "./users"
import { OnlineUser } from "../../shared-src/models"
import { Room, User } from "../models"
import { RoomModel, UserModel } from "../databaseModels"

// MARK: initial state

const initialState: State = {
    currentIndex: -1,
    onlineUsersMap: {},
}

// MARK: users factories

export const addOnlineUser = ((state: State) => (
    key: string,
    onlineUserData: Pick<OnlineUser, "username" | "roomId">
) => _addOnlineUser(state, key, onlineUserData))(initialState)

export const getDataForUser = ((state: State) => (userId: string) =>
    _getDataForUser(state, userId))(initialState)

export const updateUserRoom = ((state: State) => (
    key: string,
    roomId: string
) => _updateUserRoom(state, key, roomId))(initialState)

export const removeOnlineUser = ((state: State) => (key: string) =>
    _removeOnlineUser(state, key))(initialState)

export const getOnlineUsers = ((state: State) => () => _getOnlineUsers(state))(
    initialState
)

export const constructClientData = ((
    state: State,
    getDataForUser: GetDataForUserFunction,
    RoomModel: Model<Room & Document, {}>
) => (userId: string) =>
    _constructClientData(state, getDataForUser, RoomModel, userId))(
    initialState,
    _getDataForUser,
    RoomModel
)

export const deserializeUser = ((UserModel: Model<User & Document, {}>) => (
    id: string
) => _deserializeUser(UserModel, id))(UserModel)

// MARK: initialize

export { initialize } from "./initialize"
