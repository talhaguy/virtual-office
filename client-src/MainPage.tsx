import React from "react"
import { LogoutForm } from "./LogoutForm"
import { OnlineUser } from "../shared-src/models"

interface MainPageProps {
    onlineUsers: OnlineUser[]
}

export function MainPage({ onlineUsers }: MainPageProps) {
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
            <br />
            <LogoutForm />
        </div>
    )
}
