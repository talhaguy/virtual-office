import React from "react"
import { UserColor } from "../shared-src/models/UserColor"
import styles from "./RoomUser.module.css"

interface RoomUserProps {
    username: string
    color: UserColor
}

export const RoomUser: React.FC<RoomUserProps> = ({ username, color }) => {
    let userColorClassName: string
    switch (color) {
        case UserColor.Red:
            userColorClassName = styles.userColorRed
            break
        case UserColor.Orange:
            userColorClassName = styles.userColorOrange
            break
        case UserColor.Blue:
            userColorClassName = styles.userColorBlue
            break
        case UserColor.Yellow:
            userColorClassName = styles.userColorYellow
            break
        case UserColor.Green:
            userColorClassName = styles.userColorGreen
            break
        case UserColor.Purple:
            userColorClassName = styles.userColorPurple
            break
        case UserColor.Cyan:
            userColorClassName = styles.userColorCyan
            break
        case UserColor.SkyBlue:
            userColorClassName = styles.userColorSkyBlue
            break
    }

    return (
        <div>
            <div className={`${styles.container} ${userColorClassName}`}></div>
            <div>{username}</div>
        </div>
    )
}
