import React from "react"
import styles from "./TextInput.module.css"

interface TextInputProps {
    name: string
    label?: string
}

export const TextInput: React.FC<TextInputProps> = ({ name, label }) => {
    return (
        <div>
            {label ? <label>{label}</label> : ""}
            <input type="text" name={name} className={styles.input}></input>
        </div>
    )
}
