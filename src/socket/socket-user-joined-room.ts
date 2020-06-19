import { Server, Socket } from "socket.io"
import {
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
        getDataForUser: GetDataForUserFunction,
        updateUserRoom: UpdateUserRoomFunction,
        constructClientData: ConstructClientDataFunction,
        userJoinedRoomConstructClientDataSuccess: UserJoinedRoomConstructClientDataSuccessFunction,
        userJoinedRoomConstructClientDataError: UserJoinedRoomConstructClientDataErrorFunction
    ): OnUserJoinedRoomFunction
}

export interface OnUserJoinedRoomFunction {
    (
        ioEventResponseData: IOEventResponseData<IOEventRoomChangeData>,
        socket: Socket,
        userId: string
    ): void
}

export const onUserJoinedRoomFunctionFactory: OnUserJoinedRoomFactoryFunction = (
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
