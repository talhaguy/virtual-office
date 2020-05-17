import React, { useState, useEffect } from "react"
import io from "socket.io-client"

import { LogoutForm } from "./LogoutForm"
import {
    OnlineUser,
    RoomClientData,
    ServerResponse,
    RepsonseStatusText,
    ClientData,
    IOEventResponseData,
} from "../shared-src/models"
import { Room } from "./Room"
import { IOEvents } from "../shared-src/constants"

import styles from "./MainPage.module.css"

interface MainPageProps {
    isLoggedIn: boolean
}

export function MainPage({ isLoggedIn }: MainPageProps) {
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
    const [rooms, setRooms] = useState<RoomClientData[]>([])

    useEffect(() => {
        if (isLoggedIn) {
            const socket = io()

            fetch("/data/getClientData", {
                method: "post",
            })
                .then<ServerResponse<ClientData>>((response) => response.json())
                .then((response) => {
                    if (response.status === RepsonseStatusText.Success) {
                        setOnlineUsers(response.data?.onlineUsers)
                        setRooms(response.data?.rooms)
                    }
                })
                .catch((err) => {})

            socket.on(
                IOEvents.OnlineUsersChange,
                (ioEventResponseData: IOEventResponseData<ClientData>) => {
                    setOnlineUsers(ioEventResponseData.data.onlineUsers)
                    setRooms(ioEventResponseData.data.rooms)
                }
            )
        }
    }, [isLoggedIn])

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
                    {rooms.map((room, i) => (
                        <div key={i}>
                            <Room room={room} />
                        </div>
                    ))}
                </div>
            </div>
            <br />
            <LogoutForm />
        </div>
    )
}
