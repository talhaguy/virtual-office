import React from "react"

import { RoomClientData } from "../shared-src/models"
import styles from "./Room.module.css"

interface RoomProps {
    room: RoomClientData
    onJoinButtonClick: (roomId: string) => void
}

export function Room({ room, onJoinButtonClick }: RoomProps) {
    return (
        <div className={styles.container}>
            {room.id} / {room.name}
            <ul>
                {room.users.map((user, i) => (
                    <li key={i}>{user}</li>
                ))}
            </ul>
            <button onClick={() => onJoinButtonClick(room.id)}>Join</button>
        </div>
    )
}
