import { Server, Socket } from "socket.io"
import { Document } from "mongoose"
import {
    DeserializeUserFunction,
    AddOnlineUserFunction,
    RemoveOnlineUserFunction,
    ConstructClientDataFunction,
    UpdateUserRoomFunction,
    GetDataForUserFunction,
} from "./index"
import {
    IOEventResponseData,
    IOEventChatMessageData,
    IOEventRoomChangeData,
    ClientData,
    ChatMessageType,
    OnlineUser,
} from "../../shared-src/models"
import { IOEvents } from "../../shared-src/constants"
import { User } from "../models"

// MARK: deserializeUserSuccessFactory

interface DeserializeUserSuccessFactoryFunction {
    (
        addOnlineUser: AddOnlineUserFunction,
        constructClientData: ConstructClientDataFunction
    ): DeserializeUserSuccessFunction
}

interface DeserializeUserSuccessFunction {
    (socket: Socket, user: User & Document, userId: string): ReturnType<
        ConstructClientDataFunction
    >
}

export const deserializeUserSuccessFactory: DeserializeUserSuccessFactoryFunction = (
    addOnlineUser,
    constructClientData
) => (socket, user, userId) => {
    addOnlineUser(userId, {
        username: user.username,
        roomId: "desksRoom",
    })
    socket.join("desksRoom")
    return constructClientData(userId)
}

// MARK: deserializeUserError

interface DeserializeUserErrorFunction {
    (error: any): void
}

export const deserializeUserError = (error: any) => {
    console.error(error)
}

// MARK: constructClientDataSuccessFactory

interface ConstructClientDataSuccessFactoryFunction {
    (io: Server): ConstructClientDataSuccessFunction
}

interface ConstructClientDataSuccessFunction {
    (clientData: ClientData): void
}

export const constructClientDataSuccessFactory: ConstructClientDataSuccessFactoryFunction = (
    io
) => (clientData) => {
    const data: IOEventResponseData<ClientData> = {
        data: clientData,
    }
    io.emit(IOEvents.OnlineUsersChange, data)
}

// MARK: socketDisconnectConstructClientDataSuccessFactory

interface SocketDisconnectConstructClientDataSuccessFactoryFunction {
    (io: Server): SocketDisconnectConstructClientDataSuccessFunction
}

interface SocketDisconnectConstructClientDataSuccessFunction {
    (clientData: ClientData): void
}

export const socketDisconnectConstructClientDataSuccessFactory: SocketDisconnectConstructClientDataSuccessFactoryFunction = (
    io
) => (clientData) => {
    const data: IOEventResponseData<ClientData> = {
        data: clientData,
    }
    io.emit(IOEvents.OnlineUsersChange, data)
}

// MARK: onSocketDisconnectFactory

interface OnSocketDisconnectFactoryFunction {
    (
        removeOnlineUser: RemoveOnlineUserFunction,
        constructClientData: ConstructClientDataFunction,
        onSocketDisconnectConstructClientDataSuccess: SocketDisconnectConstructClientDataSuccessFunction
    ): OnSocketDisconnectFunction
}

interface OnSocketDisconnectFunction {
    (userId: string): void
}

export const onSocketDisconnectFactory: OnSocketDisconnectFactoryFunction = (
    removeOnlineUser,
    constructClientData,
    onSocketDisconnectConstructClientDataSuccess
) => (userId) => {
    removeOnlineUser(userId)

    constructClientData(userId)
        .then((clientData) => {
            onSocketDisconnectConstructClientDataSuccess(clientData)
        })
        .catch((error) => {
            console.error(error)
        })
}

// MARK: userJoinedRoomConstructClientDataSuccessFactory

interface UserJoinedRoomConstructClientDataSuccessFactoryFunction {
    (io: Server): UserJoinedRoomConstructClientDataSuccessFunction
}

interface UserJoinedRoomConstructClientDataSuccessFunction {
    (
        clientData: ClientData,
        ioEventResponseData: IOEventResponseData<IOEventRoomChangeData>,
        user: OnlineUser
    ): void
}

export const userJoinedRoomConstructClientDataSuccessFactory: UserJoinedRoomConstructClientDataSuccessFactoryFunction = (
    io
) => (clientData, ioEventResponseData, user) => {
    const data: IOEventResponseData<ClientData> = {
        data: clientData,
    }
    io.emit(IOEvents.OnlineUsersChange, data)

    const time = new Date().getTime()

    const ioChatEventResponseDataToPreviousRoom: IOEventResponseData<IOEventChatMessageData> = {
        data: {
            type: ChatMessageType.Status,
            roomId: ioEventResponseData.data.previousRoomId,
            message: `${user.username} left ${ioEventResponseData.data.previousRoomId} and joined ${ioEventResponseData.data.newRoomId}`,
            time,
        },
    }

    const ioChatEventResponseDataToNewRoom: IOEventResponseData<IOEventChatMessageData> = {
        data: {
            type: ChatMessageType.Status,
            roomId: ioEventResponseData.data.newRoomId,
            message: `${user.username} left ${ioEventResponseData.data.previousRoomId} and joined ${ioEventResponseData.data.newRoomId}`,
            time,
        },
    }

    io.to(ioEventResponseData.data.previousRoomId).emit(
        IOEvents.UserChat,
        ioChatEventResponseDataToPreviousRoom
    )

    io.to(ioEventResponseData.data.newRoomId).emit(
        IOEvents.UserChat,
        ioChatEventResponseDataToNewRoom
    )
}

// MARK: userJoinedRoomConstructClientDataError

interface UserJoinedRoomConstructClientDataErrorFunction {
    (error: any): void
}

export const userJoinedRoomConstructClientDataError: UserJoinedRoomConstructClientDataErrorFunction = (
    error
) => {
    console.error(error)
}

// MARK: onUserJoinedRoomFactory

interface OnUserJoinedRoomFactoryFunction {
    (
        io: Server,
        getDataForUser: GetDataForUserFunction,
        updateUserRoom: UpdateUserRoomFunction,
        constructClientData: ConstructClientDataFunction,
        userJoinedRoomConstructClientDataSuccess: UserJoinedRoomConstructClientDataSuccessFunction,
        userJoinedRoomConstructClientDataError: UserJoinedRoomConstructClientDataErrorFunction
    ): OnUserJoinedRoomFunction
}

interface OnUserJoinedRoomFunction {
    (
        ioEventResponseData: IOEventResponseData<IOEventRoomChangeData>,
        socket: Socket,
        userId: string
    ): void
}

export const onUserJoinedRoomFunctionFactory: OnUserJoinedRoomFactoryFunction = (
    io,
    getDataForUser,
    updateUserRoom,
    constructClientData,
    userJoinedRoomConstructClientDataSuccess,
    userJoinedRoomConstructClientDataError
) => (ioEventResponseData, socket, userId) => {
    console.log("join", ioEventResponseData.data)

    const user = getDataForUser(userId)

    socket.leaveAll()
    socket.join(ioEventResponseData.data.newRoomId)

    updateUserRoom(userId, ioEventResponseData.data.newRoomId)

    constructClientData(userId)
        .then((clientData) => {
            userJoinedRoomConstructClientDataSuccess(
                clientData,
                ioEventResponseData,
                user
            )
        })
        .catch((error) => {
            userJoinedRoomConstructClientDataError(error)
        })
}

// MARK: onUserChatFactory

interface OnUserChatFactoryFunction {
    (io: Server, getDataForUser: GetDataForUserFunction): OnUserChatFunction
}

interface OnUserChatFunction {
    (
        ioEventResponseData: IOEventResponseData<
            Omit<
                IOEventChatMessageData,
                "username" | "userColor" | "time" | "type"
            >
        >,
        userId: string
    ): void
}

export const onUserChatFactory: OnUserChatFactoryFunction = (
    io,
    getDataForUser
) => (ioEventResponseData, userId) => {
    console.log("got a chat...", ioEventResponseData.data.message)

    const user = getDataForUser(userId)
    const time = new Date().getTime()

    const ioChatEventResponseData: IOEventResponseData<IOEventChatMessageData> = {
        data: {
            type: ChatMessageType.UserMessage,
            roomId: ioEventResponseData.data.roomId,
            message: ioEventResponseData.data.message,
            username: user.username,
            userColor: user.color,
            time,
        },
    }

    console.log("emitting chat data...", ioChatEventResponseData)

    io.to(ioEventResponseData.data.roomId).emit(
        IOEvents.UserChat,
        ioChatEventResponseData
    )
}

// MARK: onConnectionFactory

interface OnConnectionFactoryFunction {
    (
        deserializeUser: DeserializeUserFunction,
        deserializeUserSuccess: DeserializeUserSuccessFunction,
        deserializeUserError: DeserializeUserErrorFunction,
        constructClientDataSuccess: ConstructClientDataSuccessFunction,
        onSocketDisconnect: OnSocketDisconnectFunction,
        onUserJoinedRoom: OnUserJoinedRoomFunction,
        onUserChat: OnUserChatFunction
    ): OnConnectionFunction
}

interface OnConnectionFunction {
    (socket: Socket): void
}

export const onConnectionFactory: OnConnectionFactoryFunction = (
    deserializeUser,
    deserializeUserSuccess,
    deserializeUserError,
    constructClientDataSuccess,
    onSocketDisconnect,
    onUserJoinedRoom,
    onUserChat
) => (socket) => {
    console.log("a user connected")
    if (!socket.request.session.passport) {
        return
    }
    const userId = socket.request.session.passport.user

    deserializeUser(userId)
        .then((user) => {
            return deserializeUserSuccess(socket, user, userId)
        })
        .then((clientData) => {
            constructClientDataSuccess(clientData)
        })
        .catch((error) => {
            deserializeUserError(error)
        })

    socket.on("disconnect", () => {
        onSocketDisconnect(userId)
    })

    socket.on(
        IOEvents.UserJoinedRoom,
        (ioEventResponseData: IOEventResponseData<IOEventRoomChangeData>) => {
            onUserJoinedRoom(ioEventResponseData, socket, userId)
        }
    )

    socket.on(
        IOEvents.UserChat,
        (
            ioEventResponseData: IOEventResponseData<
                Omit<
                    IOEventChatMessageData,
                    "username" | "userColor" | "time" | "type"
                >
            >
        ) => {
            onUserChat(ioEventResponseData, userId)
        }
    )
}
