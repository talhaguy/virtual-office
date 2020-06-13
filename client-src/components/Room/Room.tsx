import React from "react"

import { RoomClientData, DoorSide } from "../../../shared-src/models"
import { RoomUser } from "../RoomUser"

import styles from "./Room.module.css"

interface RoomProps {
    room: RoomClientData
    currentUserName: string
}

export function Room({ room, currentUserName }: RoomProps) {
    const doorSize = 70
    const borderSize = 2

    return (
        <div className={styles.container}>
            {room.doors.map((door, i) => {
                let doorSideStyle = {}

                if (
                    door.side === DoorSide.Top ||
                    door.side === DoorSide.Bottom
                ) {
                    doorSideStyle = {
                        [door.side === DoorSide.Top ? "top" : "bottom"]: 0,
                        left: door.position + "%",
                        height: "2px",
                        width: `${doorSize}px`,
                        transform: `translate(-${
                            doorSize / 2
                        }px, ${borderSize}px)`,
                    }
                } else {
                    doorSideStyle = {
                        [door.side === DoorSide.Right ? "right" : "left"]: 0,
                        top: `${door.position}%`,
                        height: `${doorSize}px`,
                        width: "2px",
                        transform: `translate(-${borderSize}px, -${
                            doorSize / 2
                        }px)`,
                    }
                }

                return (
                    <div
                        key={i}
                        className={styles.door}
                        style={doorSideStyle}
                        data-test={door.side}
                    ></div>
                )
            })}

            <ul className={styles.userList}>
                {room.users.map((user, i) => (
                    <li className={styles.userContainer} key={i}>
                        {user.username === currentUserName ? (
                            <span className={styles.currentUserIndicator}>
                                &#9660;
                            </span>
                        ) : (
                            ""
                        )}
                        <RoomUser username={user.username} color={user.color} />
                    </li>
                ))}
            </ul>
        </div>
    )
}
