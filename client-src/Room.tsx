import React from "react"

import { RoomClientData } from "../shared-src/models"
import { RoomUser } from "./RoomUser"

import styles from "./Room.module.css"

interface RoomProps {
    room: RoomClientData
}

export function Room({ room }: RoomProps) {
    return (
        <div className={styles.container}>
            <ul className={styles.userList}>
                {room.users.map((user, i) => (
                    <li key={i}>
                        <RoomUser username={user.username} color={user.color} />
                    </li>
                ))}
            </ul>
        </div>
    )
}
