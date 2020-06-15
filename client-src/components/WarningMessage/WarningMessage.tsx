import React from "react"
import styles from "./WarningMessage.module.css"

export enum WarningMessageType {
    Error,
    Info,
}

interface WarningMessageProps {
    type?: WarningMessageType
}

export const WarningMessage: React.FC<WarningMessageProps> = ({
    type = WarningMessageType.Info,
    children,
}) => {
    return (
        <div
            className={`${styles.container} ${
                type === WarningMessageType.Info ? styles.info : styles.error
            }`}
        >
            {children}
        </div>
    )
}
