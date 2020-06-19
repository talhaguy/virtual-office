import { Server, Socket } from "socket.io"
import { Document } from "mongoose"
import {
    DeserializeUserFunction,
    AddOnlineUserFunction,
    ConstructClientDataFunction,
    OnSocketDisconnectFunction,
    OnUserJoinedRoomFunction,
    OnUserChatFunction,
} from "./index"
import {
    IOEventResponseData,
    IOEventChatMessageData,
    IOEventRoomChangeData,
    ClientData,
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

export interface OnConnectionFunction {
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
