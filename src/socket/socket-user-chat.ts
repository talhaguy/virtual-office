import { Server } from "socket.io"
import { GetDataForUserFunction } from "./index"
import {
    IOEventResponseData,
    IOEventChatMessageData,
    ChatMessageType,
} from "../../shared-src/models"
import { IOEvents } from "../../shared-src/constants"

interface OnUserChatFactoryFunction {
    (io: Server, getDataForUser: GetDataForUserFunction): OnUserChatFunction
}

export interface OnUserChatFunction {
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
