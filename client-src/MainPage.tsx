import React from "react"

import { LogoutForm } from "./LogoutForm"
import { OnlineUser, RoomClientData } from "../shared-src/models"
import { Room } from "./Room"
import styles from "./MainPage.module.css"

interface MainPageProps {
    onlineUsers: OnlineUser[]
    rooms: RoomClientData[]
}

export function MainPage({ onlineUsers, rooms }: MainPageProps) {
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
