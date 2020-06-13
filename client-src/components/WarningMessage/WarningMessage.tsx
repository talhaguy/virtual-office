import React from "react"
import styles from "./WarningMessage.module.css"

export const WarningMessage: React.FC<{}> = ({ children }) => {
    return <div className={styles.container}>{children}</div>
}
