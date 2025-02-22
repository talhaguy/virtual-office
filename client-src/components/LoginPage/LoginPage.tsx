import React, { useContext, useState } from "react"
import { Link } from "react-router-dom"

import { TextInput } from "../TextInput"
import { Button, ButtonSize, ButtonType } from "../Button"
import { FormRow, FormRowVerticalSpacing } from "../FormRow"
import { DependenciesContext } from "../../DependenciesContext"
import { SinglePageFormContainer } from "../SinglePageForm"
import { ErrorMessages } from "../../constants/messages"

interface LoginFormHTMLFormControlsCollection
    extends HTMLFormControlsCollection {
    username: HTMLInputElement
    password: HTMLInputElement
}

export const LoginPage = () => {
    const {
        validation: { validateEmail, validatePassword },
        form: { submitHtmlForm },
    } = useContext(DependenciesContext)
    const [isEmailValid, setIsEmailValid] = useState(true)
    const [isPasswordValid, setIsPasswordValid] = useState(true)

    const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const { username, password } = event.currentTarget
            .elements as LoginFormHTMLFormControlsCollection

        // validate username
        const isEmailValid = validateEmail(username.value)
        setIsEmailValid(isEmailValid)

        // validate password
        const isPasswordValid = validatePassword(password.value)
        setIsPasswordValid(isPasswordValid)

        if (isEmailValid && isPasswordValid) {
            submitHtmlForm(event.currentTarget)
        }
    }

    return (
        <SinglePageFormContainer title="Login">
            <form action="/login" method="POST" onSubmit={onSubmitHandler}>
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
                    />
                </FormRow>
                <FormRow verticalSpacing={FormRowVerticalSpacing.Large}>
                    <Button
                        size={ButtonSize.Full}
                        type={ButtonType.Submit}
                        label="Login"
                    />
                </FormRow>
                <FormRow verticalSpacing={FormRowVerticalSpacing.Large}>
                    New User? <Link to="/register">Register here</Link>.
                </FormRow>
            </form>
        </SinglePageFormContainer>
    )
}
