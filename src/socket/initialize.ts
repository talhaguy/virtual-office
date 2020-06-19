import socketIO from "socket.io"
import { Server } from "http"
import { RequestHandler } from "express"
import {
    deserializeUser,
    addOnlineUser,
    removeOnlineUser,
    constructClientData,
    updateUserRoom,
    getDataForUser,
} from "./index"
import {
    IOEventResponseData,
    IOEventChatMessageData,
    IOEventRoomChangeData,
    ClientData,
    ChatMessageType,
} from "../../shared-src/models"
import { IOEvents } from "../../shared-src/constants"

export function initialize(server: Server, sessionMiddleware: RequestHandler) {
    const io = socketIO(server)

    io.use((socket, next) => {
        sessionMiddleware(socket.request, {} as any, next)
    })

    io.on("connection", (socket) => {
        console.log("a user connected")
        if (!socket.request.session.passport) {
            return
        }
        const userId = socket.request.session.passport.user

        deserializeUser(userId)
            .then((user) => {
                addOnlineUser(userId, {
                    username: user.username,
                    roomId: "desksRoom",
                })
                socket.join("desksRoom")
                return constructClientData(userId)
            })
            .then((clientData) => {
                const data: IOEventResponseData<ClientData> = {
                    data: clientData,
                }
                io.emit(IOEvents.OnlineUsersChange, data)
            })
            .catch((error) => {
                console.error(error)
            })

        socket.on("disconnect", () => {
            console.log("user disconnected")

            removeOnlineUser(userId)

            constructClientData(userId)
                .then((clientData) => {
                    const data: IOEventResponseData<ClientData> = {
                        data: clientData,
                    }
                    io.emit(IOEvents.OnlineUsersChange, data)
                })
                .catch((error) => {
                    console.error(error)
                })
        })

        socket.on(
            IOEvents.UserJoinedRoom,
            (
                ioEventResponseData: IOEventResponseData<IOEventRoomChangeData>
            ) => {
                console.log("join", ioEventResponseData.data)

                const user = getDataForUser(userId)

                socket.leaveAll()
                socket.join(ioEventResponseData.data.newRoomId)

                updateUserRoom(userId, ioEventResponseData.data.newRoomId)

                constructClientData(userId)
                    .then((clientData) => {
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
                    })
                    .catch((error) => {
                        console.error(error)
                    })
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
        )
    })
}
