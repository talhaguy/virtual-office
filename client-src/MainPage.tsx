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
} from "../shared-src/models"
import { Room } from "./Room"
import { IOEvents } from "../shared-src/constants"

import styles from "./MainPage.module.css"
import { Panel, PanelType, PanelTitlePosition } from "./Panel"
import { Button, ButtonType } from "./Button"

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
    const [messages, setMessages] = useState<string[]>([])
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
                const newMessages = messages.slice()
                newMessages.push(ioEventResponseData.data.message)
                setMessages(newMessages)
            }
        )

        return () => {
            socketRef.current.off(IOEvents.OnlineUsersChange)
            socketRef.current.off(IOEvents.UserChat)
        }
    }, [isLoggedIn, messages, currentUser])

    const getRoomSizeClassName = (width: number, height: number) => {
        let className = ""

        switch (width) {
            case 1:
                className += styles.roomsWidthSmall
                break
            case 2:
                className += styles.roomsWidthMedium
                break
            case 3:
                className += styles.roomsWidthLarge
                break
        }

        switch (height) {
            case 1:
                className += " " + styles.roomsHeightSmall
                break
            case 2:
                className += " " + styles.roomsHeightMedium
                break
            case 3:
                className += " " + styles.roomsHeightLarge
                break
        }

        return className
    }

    const onRoomJoinButtonClick = (roomId: string) => {
        const data: IOEventResponseData<string> = {
            data: roomId,
        }
        socketRef.current.emit(IOEvents.UserJoinedRoom, data)
    }

    const onChatMessageSubmitHandler = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault()

        const message = event.currentTarget.elements["message"].value
        const data: IOEventResponseData<IOEventChatMessageData> = {
            data: {
                roomId: currentUser.roomId,
                message,
            },
        }
        socketRef.current.emit(IOEvents.UserChat, data)
    }

    return (
        <div>
            <h2>Main Page</h2>
            <div>
                Online Users:
                <ul>
                    {onlineUsers.map((user, i) => (
                        <li key={i}>{user.username}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Rooms</h3>
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
                                    extraClassNames={styles.height100Percent}
                                    title={room.name}
                                    titleButton={
                                        <Button
                                            type={ButtonType.Normal}
                                            label={"Join"}
                                            onClickHandler={() =>
                                                onRoomJoinButtonClick(room.id)
                                            }
                                        />
                                    }
                                    titlePosition={
                                        i < 2
                                            ? PanelTitlePosition.Top
                                            : PanelTitlePosition.Bottom
                                    }
                                    type={PanelType.DropShadowAsBorder}
                                >
                                    <Room room={room} />
                                </Panel>
                            </div>
                        )
                    })}
                </div>
            </div>
            <Chat
                messages={messages}
                onSubmitHandler={onChatMessageSubmitHandler}
            />
            <br />
            <LogoutForm />
        </div>
    )
}
