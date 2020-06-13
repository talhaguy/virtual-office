import React from "react"
import { Button, ButtonType, ButtonSize } from "./Button"
import styles from "./LogoutForm.module.css"

interface LogoutFormProps {
    username: string
    userColor: string
}

export const LogoutForm: React.FC<LogoutFormProps> = ({
    username,
    userColor,
}) => (
    <form action="/logout" method="POST" className={styles.container}>
        Signed in as{" "}
        <span className={styles.userName} style={{ color: userColor }}>
            {username}
        </span>
        <span className={styles.buttonContainer}>
            <Button
                type={ButtonType.Submit}
                size={ButtonSize.Normal}
                label={"Log out"}
            />
        </span>
    </form>
)
