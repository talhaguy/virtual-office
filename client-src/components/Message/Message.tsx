import React from "react"
import styles from "./Message.module.css"

export enum MessageType {
    Error,
    Info,
}

interface MessageProps {
    type?: MessageType
}

export const Message: React.FC<MessageProps> = ({
    type = MessageType.Info,
    children,
}) => {
    return (
        <div
            className={`${styles.container} ${
                type === MessageType.Info ? styles.info : styles.error
            }`}
        >
            {children}
        </div>
    )
}
