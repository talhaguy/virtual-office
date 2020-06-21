import React, { useContext } from "react"
import { Button, ButtonType, ButtonSize } from "../Button"
import * as styles from "./LogoutForm.module.css"
import { DependenciesContext } from "../../DependenciesContext"

interface LogoutFormProps {
    username: string
    userColor: string
}

export const LogoutForm: React.FC<LogoutFormProps> = ({
    username,
    userColor,
}) => {
    const {
        form: { submitHtmlForm },
    } = useContext(DependenciesContext)

    const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        submitHtmlForm(event.currentTarget)
    }

    return (
        <form
            action="/logout"
            method="POST"
            className={styles.container}
            onSubmit={onSubmitHandler}
        >
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
}
