import React from "react"
import styles from "./TextInput.module.css"

interface TextInputProps {
    name: string
    label?: string
    autocomplete?: string
}

export const TextInput: React.FC<TextInputProps> = ({
    name,
    label,
    autocomplete = "on",
}) => {
    return (
        <div>
            {label ? <label>{label}</label> : ""}
            <input
                type="text"
                name={name}
                autoComplete={autocomplete}
                className={styles.input}
            ></input>
        </div>
    )
}
