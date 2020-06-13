import React, { useState } from "react"
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
    const [hasValue, setHasValue] = useState(false)

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHasValue(event.currentTarget.value !== "")
    }

    return (
        <div className={styles.container}>
            <input
                type={type}
                name={name}
                autoComplete={autocomplete}
                className={styles.input}
                onChange={onChangeHandler}
            ></input>
            {label ? (
                <label
                    className={`${styles.label} ${
                        hasValue ? styles.labelFloat : ""
                    }`}
                >
                    {label}
                </label>
            ) : (
                ""
            )}
        </div>
    )
}
