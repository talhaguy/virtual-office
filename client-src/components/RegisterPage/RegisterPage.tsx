import React, { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { DependenciesContext } from "../../DependenciesContext"
import { FormRowVerticalSpacing, FormRow } from "../FormRow"
import { SinglePageFormContainer } from "../SinglePageForm"
import { TextInput } from "../TextInput"
import { Button, ButtonSize, ButtonType } from "../Button"
import styles from "./RegisterPage.module.css"

interface RegisterFormHTMLFormControlsCollection
    extends HTMLFormControlsCollection {
    username: HTMLInputElement
    password: HTMLInputElement
    passwordCheck: HTMLInputElement
}

export const RegisterPage = () => {
    const {
        validation: { validateEmail, validatePassword },
    } = useContext(DependenciesContext)
    const [isEmailValid, setIsEmailValid] = useState(true)
    const [isPasswordValid, setIsPasswordValid] = useState(true)
    const [isPasswordCheckValid, setIsPasswordCheckValid] = useState(true)
    const [isPasswordMatching, setIsPasswordMatching] = useState(true)

    const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const { username, password, passwordCheck } = event.currentTarget
            .elements as RegisterFormHTMLFormControlsCollection

        // validate username
        const isEmailValid = validateEmail(username.value)
        setIsEmailValid(isEmailValid)

        // validate password
        const isPasswordValid = validatePassword(password.value)
        setIsPasswordValid(isPasswordValid)

        // validate passwordCheck
        const isPasswordCheckValid = validatePassword(passwordCheck.value)
        setIsPasswordCheckValid(isPasswordCheckValid)

        // check if password and passwordCheck are equal
        const isPasswordMatching = password.value === passwordCheck.value
        setIsPasswordMatching(isPasswordMatching)

        if (
            isEmailValid &&
            isPasswordValid &&
            isPasswordCheckValid &&
            isPasswordMatching
        ) {
            event.currentTarget.submit()
        }
    }

    const clearPasswordMatchingMessage = () => {
        setIsPasswordMatching(true)
    }

    return (
        <SinglePageFormContainer title="Register">
            <form action="/register" method="POST" onSubmit={onSubmitHandler}>
                <FormRow>
                    <TextInput
                        label="Username"
                        name="username"
                        isValid={isEmailValid}
                        validation={(value) => {
                            setIsEmailValid(validateEmail(value))
                        }}
                        errorMessage="Please enter an appropriate email address"
                    />
                </FormRow>
                <FormRow>
                    <TextInput
                        label="Password"
                        type="password"
                        name="password"
                        isValid={isPasswordValid}
                        validation={(value) => {
                            setIsPasswordValid(validatePassword(value))
                        }}
                        errorMessage="Please enter a password of at least 6 characters"
                        onFocusHandler={clearPasswordMatchingMessage}
                    />
                </FormRow>
                <FormRow>
                    <TextInput
                        label="Re-enter Password"
                        type="password"
                        name="passwordCheck"
                        isValid={isPasswordCheckValid}
                        validation={(value) => {
                            setIsPasswordCheckValid(validatePassword(value))
                        }}
                        errorMessage="Please enter a password of at least 6 characters"
                        onFocusHandler={clearPasswordMatchingMessage}
                    />
                </FormRow>
                {!isPasswordMatching ? (
                    <FormRow>
                        <span className={styles.errorMessage}>
                            Please enter matching passwords
                        </span>
                    </FormRow>
                ) : (
                    ""
                )}
                <FormRow verticalSpacing={FormRowVerticalSpacing.Large}>
                    <Button
                        size={ButtonSize.Full}
                        type={ButtonType.Submit}
                        label="Register"
                    />
                </FormRow>
                <FormRow verticalSpacing={FormRowVerticalSpacing.Large}>
                    Already have an account? <Link to="/login">Login here</Link>
                    .
                </FormRow>
            </form>
        </SinglePageFormContainer>
    )
}
