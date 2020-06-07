import React from "react"
import styles from "./Button.module.css"

export enum ButtonType {
    Normal,
    Full,
}

interface ButtonProps {
    type: ButtonType
    label: string
    onClickHandler: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void
}

export const Button: React.FC<ButtonProps> = ({
    type,
    label,
    onClickHandler,
}) => {
    const typeClassName =
        type === ButtonType.Full ? styles.typeFull : styles.typeNormal

    return (
        <button
            type="button"
            className={`${styles.button} ${typeClassName}`}
            onClick={onClickHandler}
        >
            <span className={styles.textVertNudge}>{label}</span>
        </button>
    )
}
