import React, { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { DependenciesContext } from "../../DependenciesContext"
import { FormRowVerticalSpacing, FormRow } from "../FormRow"
import { SinglePageFormContainer } from "../SinglePageForm"
import { TextInput } from "../TextInput"
import { Button, ButtonSize, ButtonType } from "../Button"
import * as styles from "./RegisterPage.module.css"
import { ErrorMessages } from "../../constants/messages"

interface RegisterFormHTMLFormControlsCollection
    extends HTMLFormControlsCollection {
    username: HTMLInputElement
    password: HTMLInputElement
    passwordCheck: HTMLInputElement
}

export const RegisterPage = () => {
    const {
        validation: { validateEmail, validatePassword },
        form: { submitHtmlForm },
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
            submitHtmlForm(event.currentTarget)
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
                        errorMessage={ErrorMessages.EmailPattern}
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
                        errorMessage={ErrorMessages.PasswordPattern}
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
                        errorMessage={ErrorMessages.PasswordPattern}
                        onFocusHandler={clearPasswordMatchingMessage}
                    />
                </FormRow>
                {!isPasswordMatching ? (
                    <FormRow>
                        <span className={styles.errorMessage}>
                            {ErrorMessages.RegisterPasswordMismatch}
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
