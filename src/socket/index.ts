import { Model, Document } from "mongoose"
import {
    State,
    GetDataForUserFunction as _GetDataForUserFunction,
    addOnlineUser as _addOnlineUser,
    getDataForUser as _getDataForUser,
    updateUserRoom as _updateUserRoom,
    removeOnlineUser as _removeOnlineUser,
    getOnlineUsers as _getOnlineUsers,
    constructClientData as _constructClientData,
    deserializeUser as _deserializeUser,
} from "./users"
import { OnlineUser, ClientData } from "../../shared-src/models"
import { Room, User } from "../models"
import { RoomModel, UserModel } from "../databaseModels"

// MARK: initial state

const initialState: State = {
    currentIndex: -1,
    onlineUsersMap: {},
}

// MARK: users factories

export interface AddOnlineUserFunction {
    (key: string, onlineUserData: Pick<OnlineUser, "username" | "roomId">): void
}

export const addOnlineUser: AddOnlineUserFunction = ((state: State) => (
    key: string,
    onlineUserData: Pick<OnlineUser, "username" | "roomId">
) => _addOnlineUser(state, key, onlineUserData))(initialState)

export interface GetDataForUserFunction {
    (userId: string): OnlineUser
}

export const getDataForUser: GetDataForUserFunction = ((state: State) => (
    userId: string
) => _getDataForUser(state, userId))(initialState)

export interface UpdateUserRoomFunction {
    (key: string, roomId: string): void
}

export const updateUserRoom: UpdateUserRoomFunction = ((state: State) => (
    key: string,
    roomId: string
) => _updateUserRoom(state, key, roomId))(initialState)

export interface RemoveOnlineUserFunction {
    (key: string): void
}

export const removeOnlineUser: RemoveOnlineUserFunction = ((state: State) => (
    key: string
) => _removeOnlineUser(state, key))(initialState)

export const getOnlineUsers = ((state: State) => () => _getOnlineUsers(state))(
    initialState
)

export interface ConstructClientDataFunction {
    (userId: string): Promise<ClientData>
}

export const constructClientData: ConstructClientDataFunction = ((
    state: State,
    getDataForUser: _GetDataForUserFunction,
    RoomModel: Model<Room & Document, {}>
) => (userId: string) =>
    _constructClientData(state, getDataForUser, RoomModel, userId))(
    initialState,
    _getDataForUser,
    RoomModel
)

export interface DeserializeUserFunction {
    (id: string): Promise<User & Document>
}

export const deserializeUser: DeserializeUserFunction = ((
    UserModel: Model<User & Document, {}>
) => (id: string) => _deserializeUser(UserModel, id))(UserModel)

// MARK: socket function interfaces

export { OnSocketDisconnectFunction } from "./socket-disconnect"
export { OnUserChatFunction } from "./socket-user-chat"
export { OnUserJoinedRoomFunction } from "./socket-user-joined-room"

// MARK: initialize

import socketIO from "socket.io"
import { Server } from "http"
import { RequestHandler } from "express"
import {
    onConnectionFactory,
    deserializeUserSuccessFactory,
    deserializeUserError,
    constructClientDataSuccessFactory,
} from "./socket-connection"
import {
    onSocketDisconnectFactory,
    socketDisconnectConstructClientDataSuccessFactory,
} from "./socket-disconnect"
import { onUserChatFactory } from "./socket-user-chat"
import {
    onUserJoinedRoomFunctionFactory,
    userJoinedRoomConstructClientDataSuccessFactory,
    userJoinedRoomConstructClientDataError,
} from "./socket-user-joined-room"

export function initialize(server: Server, sessionMiddleware: RequestHandler) {
    const io = socketIO(server)

    const deserializeUserSuccess = deserializeUserSuccessFactory(
        addOnlineUser,
        constructClientData
    )

    const constructClientDataSuccess = constructClientDataSuccessFactory(io)

    const socketDisconnectConstructClientDataSuccess = socketDisconnectConstructClientDataSuccessFactory(
        io
    )

    const onSocketDisconnect = onSocketDisconnectFactory(
        removeOnlineUser,
        constructClientData,
        socketDisconnectConstructClientDataSuccess
    )

    const userJoinedRoomConstructClientDataSuccess = userJoinedRoomConstructClientDataSuccessFactory(
        io
    )

    const onUserJoinedRoomFunction = onUserJoinedRoomFunctionFactory(
        getDataForUser,
        updateUserRoom,
        constructClientData,
        userJoinedRoomConstructClientDataSuccess,
        userJoinedRoomConstructClientDataError
    )

    const onUserChat = onUserChatFactory(io, getDataForUser)

    const onConnection = onConnectionFactory(
        deserializeUser,
        deserializeUserSuccess,
        deserializeUserError,
        constructClientDataSuccess,
        onSocketDisconnect,
        onUserJoinedRoomFunction,
        onUserChat
    )

    io.use((socket, next) => {
        sessionMiddleware(socket.request, {} as any, next)
    })

    io.on("connection", onConnection)
}
