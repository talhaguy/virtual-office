import React from "react"
import * as styles from "./Button.module.css"

export enum ButtonSize {
    Normal,
    Full,
}

export enum ButtonType {
    Button = "button",
    Submit = "submit",
}

interface ButtonProps {
    type?: ButtonType
    size: ButtonSize
    label: string
    onClickHandler?: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void
}

export const Button: React.FC<ButtonProps> = ({
    type = ButtonType.Button,
    size,
    label,
    onClickHandler,
}) => {
    const sizeClassName =
        size === ButtonSize.Full ? styles.sizeFull : styles.sizeNormal

    return (
        <button
            type={type}
            className={`${styles.button} ${sizeClassName}`}
            onClick={onClickHandler ? onClickHandler : null}
        >
            <span className={styles.textVertNudge}>{label}</span>
        </button>
    )
}
