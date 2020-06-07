import React from "react"

import { RoomClientData } from "../shared-src/models"
import styles from "./Room.module.css"
import { RoomUser } from "./RoomUser"

interface RoomProps {
    room: RoomClientData
}

export function Room({ room }: RoomProps) {
    return (
        <div className={styles.container}>
            {room.id} / {room.name}
            <ul>
                {room.users.map((user, i) => (
                    <li key={i}>
                        <RoomUser username={user.username} color={user.color} />
                    </li>
                ))}
            </ul>
        </div>
    )
}
