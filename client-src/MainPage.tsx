import React from "react"
import { LogoutForm } from "./LogoutForm"
import { OnlineUser, RoomClientData } from "../shared-src/models"

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
                Rooms:
                <ul>
                    {rooms.map((room, i) => (
                        <li key={i}>{room.name}</li>
                    ))}
                </ul>
            </div>
            <br />
            <LogoutForm />
        </div>
    )
}
