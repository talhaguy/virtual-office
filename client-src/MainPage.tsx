import React, { useState, useEffect, useRef } from "react"
import io from "socket.io-client"

import { LogoutForm } from "./LogoutForm"
import { Chat } from "./Chat"
import {
    OnlineUser,
    RoomClientData,
    ServerResponse,
    RepsonseStatusText,
    ClientData,
    IOEventResponseData,
    IOEventChatMessageData,
    IOEventRoomChangeData,
    RoomTitlePosition,
} from "../shared-src/models"
import { Room } from "./Room"
import { IOEvents } from "../shared-src/constants"

import styles from "./MainPage.module.css"
import { Panel, PanelType, PanelTitlePosition } from "./Panel"
import { Button, ButtonSize } from "./Button"

interface MainPageProps {
    username: string
    isLoggedIn: boolean
}

export function MainPage({ username, isLoggedIn }: MainPageProps) {
    const [currentUser, setCurrentUser] = useState<OnlineUser>({
        username,
        roomId: "desksRoom",
        color: null,
    })
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
    const [rooms, setRooms] = useState<RoomClientData[]>([])
    const [messages, setMessages] = useState<IOEventChatMessageData[]>([])
    const socketRef = useRef<SocketIOClient.Socket>(null)
    const firstRenderRef = useRef(true)

    useEffect(() => {
        if (isLoggedIn && firstRenderRef.current) {
            socketRef.current = io()

            fetch("/data/getClientData", {
                method: "post",
            })
                .then<ServerResponse<ClientData>>((response) => response.json())
                .then((response) => {
                    if (response.status === RepsonseStatusText.Success) {
                        setCurrentUser(response.data?.currentUser)
                        setOnlineUsers(response.data?.onlineUsers)
                        setRooms(response.data?.rooms)
                    }
                })
                .catch((err) => {
                    console.error("Error getting client data")
                    console.error(err)
                })

            firstRenderRef.current = false
        }

        socketRef.current.on(
            IOEvents.OnlineUsersChange,
            (ioEventResponseData: IOEventResponseData<ClientData>) => {
                console.log("OnlineUsersChange")
                const foundCurrentUser = ioEventResponseData.data.onlineUsers.find(
                    (user) => user.username === currentUser.username
                )
                setCurrentUser(foundCurrentUser)
                setOnlineUsers(ioEventResponseData.data.onlineUsers)
                setRooms(ioEventResponseData.data.rooms)
            }
        )

        socketRef.current.on(
            IOEvents.UserChat,
            (
                ioEventResponseData: IOEventResponseData<IOEventChatMessageData>
            ) => {
                console.log("this is chat messsss")
                console.log(ioEventResponseData)
                const newMessages = messages.slice()
                newMessages.push(ioEventResponseData.data)
                setMessages(newMessages)
            }
        )

        return () => {
            socketRef.current.off(IOEvents.OnlineUsersChange)
            socketRef.current.off(IOEvents.UserChat)
        }
    }, [isLoggedIn, messages, currentUser])

    const onRoomJoinButtonClick = (roomId: string) => {
        const data: IOEventResponseData<IOEventRoomChangeData> = {
            data: {
                previousRoomId: currentUser.roomId,
                newRoomId: roomId,
            },
        }
        socketRef.current.emit(IOEvents.UserJoinedRoom, data)
    }

    const onChatMessageSubmitHandler = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault()

        const messageInput = event.currentTarget.elements[
            "message"
        ] as HTMLInputElement

        const message = messageInput.value
        if (message) {
            const data: IOEventResponseData<Omit<
                IOEventChatMessageData,
                "username" | "userColor"
            >> = {
                data: {
                    roomId: currentUser.roomId,
                    message,
                },
            }
            socketRef.current.emit(IOEvents.UserChat, data)

            messageInput.value = ""
        }
    }

    return (
        <>
            <div className={styles.roomChatContainer}>
                <div className={styles.roomContainer}>
                    <div className={styles.rooms}>
                        {rooms.map((room, i) => {
                            return (
                                <div
                                    key={i}
                                    style={{
                                        gridColumnStart: room.gridColStart,
                                        gridColumnEnd: room.gridColEnd,
                                        gridRowStart: room.gridRowStart,
                                        gridRowEnd: room.gridRowEnd,
                                    }}
                                >
                                    <Panel
                                        extraClassNames={
                                            styles.height100Percent
                                        }
                                        title={room.name}
                                        titleButton={
                                            <Button
                                                size={ButtonSize.Normal}
                                                label={"Join"}
                                                onClickHandler={() =>
                                                    onRoomJoinButtonClick(
                                                        room.id
                                                    )
                                                }
                                            />
                                        }
                                        titlePosition={
                                            room.titlePosition ===
                                            RoomTitlePosition.Top
                                                ? PanelTitlePosition.Top
                                                : PanelTitlePosition.Bottom
                                        }
                                        type={PanelType.DropShadowAsBorder}
                                    >
                                        <Room
                                            room={room}
                                            currentUserName={
                                                currentUser.username
                                            }
                                        />
                                    </Panel>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <Chat
                    messages={messages}
                    onChatMessageSubmitHandler={onChatMessageSubmitHandler}
                />
            </div>
            <div className={styles.logoutContainer}>
                <LogoutForm />
            </div>
        </>
    )
}
