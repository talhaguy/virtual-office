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
} from "./users"
import {
    IOEventResponseData,
    IOEventChatMessageData,
    ClientData,
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
            (ioEventResponseData: IOEventResponseData<string>) => {
                console.log("join", ioEventResponseData.data)

                socket.leaveAll()
                socket.join(ioEventResponseData.data)

                updateUserRoom(userId, ioEventResponseData.data)

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
            }
        )

        socket.on(
            IOEvents.UserChat,
            (
                ioEventResponseData: IOEventResponseData<
                    Omit<IOEventChatMessageData, "username" | "userColor">
                >
            ) => {
                console.log("got a chat...", ioEventResponseData.data.message)

                const user = getDataForUser(userId)

                const ioChatEventResponseData: IOEventResponseData<IOEventChatMessageData> = {
                    data: {
                        roomId: ioEventResponseData.data.roomId,
                        message: ioEventResponseData.data.message,
                        username: user.username,
                        userColor: user.color,
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
