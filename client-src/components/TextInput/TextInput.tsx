import React, { useState } from "react"
import * as styles "./TextInput.module.css"

interface TextInputProps {
    type?: string
    name: string
    label?: string
    autocomplete?: string
    isValid?: boolean
    errorMessage?: string
    validation?: (value: string) => void
    onFocusHandler?: (event: React.FocusEvent<HTMLInputElement>) => void
}

export const TextInput: React.FC<TextInputProps> = ({
    type = "text",
    name,
    label,
    autocomplete = "on",
    isValid = true,
    errorMessage = "",
    validation = () => {},
    onFocusHandler = () => {},
}) => {
    const [hasValue, setHasValue] = useState(false)
    const id = `textInput-${name}`

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHasValue(event.currentTarget.value !== "")
    }

    const onBlurHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("blur")
        const inputValue = event.currentTarget.value
        if (inputValue !== "") {
            console.log("validating...")
            validation(event.currentTarget.value)
        }
    }

    return (
        <div className={`${styles.container} ${isValid ? "" : styles.error}`}>
            <input
                type={type}
                name={name}
                autoComplete={autocomplete}
                className={styles.input}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                onFocus={onFocusHandler}
                id={id}
            ></input>
            {label ? (
                <label
                    className={`${styles.label} ${
                        hasValue ? styles.labelFloat : ""
                    }`}
                    htmlFor={id}
                >
                    {label}
                </label>
            ) : (
                ""
            )}
            {!isValid ? (
                <div className={styles.errorMessage}>{errorMessage}</div>
            ) : (
                ""
            )}
        </div>
    )
}
