import React, { useState, useEffect, useRef, useContext } from "react"

import { LogoutForm } from "../LogoutForm"
import { Chat } from "../Chat"
import {
    OnlineUser,
    RoomClientData,
    ClientData,
    IOEventResponseData,
    IOEventChatMessageData,
    IOEventRoomChangeData,
    RoomTitlePosition,
} from "../../../shared-src/models"
import { Room } from "../Room"
import { IOEvents } from "../../../shared-src/constants"

import * as styles from "./MainPage.module.css"
import { Panel, PanelType, PanelTitlePosition } from "../Panel"
import { Button, ButtonSize } from "../Button"
import { DependenciesContext } from "../../DependenciesContext"

interface MainPageProps {
    username: string
    isLoggedIn: boolean
}

export function MainPage({ username, isLoggedIn }: MainPageProps) {
    const { io } = useContext(DependenciesContext)
    const [currentUser, setCurrentUser] = useState<OnlineUser>({
        username,
        roomId: "desksRoom",
        color: null,
    })
    const [rooms, setRooms] = useState<RoomClientData[]>([])
    const [messages, setMessages] = useState<IOEventChatMessageData[]>([])
    const socketRef = useRef<SocketIOClient.Socket>(null)
    const firstRenderRef = useRef(true)

    useEffect(() => {
        if (isLoggedIn && firstRenderRef.current) {
            socketRef.current = io()

            firstRenderRef.current = false
        }

        socketRef.current.on(
            IOEvents.OnlineUsersChange,
            (ioEventResponseData: IOEventResponseData<ClientData>) => {
                const foundCurrentUser = ioEventResponseData.data.onlineUsers.find(
                    (user) => user.username === currentUser.username
                )
                setCurrentUser(foundCurrentUser)
                setRooms(ioEventResponseData.data.rooms)
            }
        )

        socketRef.current.on(
            IOEvents.UserChat,
            (
                ioEventResponseData: IOEventResponseData<IOEventChatMessageData>
            ) => {
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
                "username" | "userColor" | "time" | "type"
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
                                    data-testid={`room-${room.id}`}
                                >
                                    <Panel
                                        extraClassNames={
                                            styles.height100Percent
                                        }
                                        title={room.name}
                                        titleButton={
                                            currentUser.roomId === room.id ? (
                                                ""
                                            ) : (
                                                <Button
                                                    size={ButtonSize.Normal}
                                                    label={"Join"}
                                                    onClickHandler={() =>
                                                        onRoomJoinButtonClick(
                                                            room.id
                                                        )
                                                    }
                                                />
                                            )
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
                <LogoutForm
                    username={currentUser.username}
                    userColor={currentUser.color}
                />
            </div>
        </>
    )
}
