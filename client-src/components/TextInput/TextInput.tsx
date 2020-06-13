import React from "react"
import styles from "./TextInput.module.css"

interface TextInputProps {
    type?: string
    name: string
    label?: string
    autocomplete?: string
}

export const TextInput: React.FC<TextInputProps> = ({
    type = "text",
    name,
    label,
    autocomplete = "on",
}) => {
    return (
        <div>
            {label ? <label>{label}</label> : ""}
            <input
                type={type}
                name={name}
                autoComplete={autocomplete}
                className={styles.input}
            ></input>
        </div>
    )
}
