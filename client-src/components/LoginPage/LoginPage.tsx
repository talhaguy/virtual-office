import React, { useContext, useState } from "react"
import { Link } from "react-router-dom"

import { Panel } from "../Panel"
import { TextInput } from "../TextInput"
import { Button, ButtonSize, ButtonType } from "../Button"
import { FormRow, FormRowVerticalSpacing } from "../FormRow"
import { WarningMessage } from "../WarningMessage"
import { DependenciesContext } from "../../DependenciesContext"

import styles from "./LoginPage.module.css"

interface LoginFormHTMLFormControlsCollection
    extends HTMLFormControlsCollection {
    username: HTMLInputElement
    password: HTMLInputElement
}

export const LoginPage = () => {
    const {
        initialClientData: { flashMessages },
        validation: { validateEmail, validatePassword },
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
            event.currentTarget.submit()
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.loginContainer}>
                <h1>Virtual Office</h1>
                <Panel title="Login">
                    <form
                        action="/login"
                        method="POST"
                        onSubmit={onSubmitHandler}
                    >
                        <FormRow>
                            <TextInput
                                label="Username"
                                name="username"
                                isValid={isEmailValid}
                                validation={validateEmail}
                                errorMessage="Please enter an appropriate email address"
                            />
                        </FormRow>
                        <FormRow>
                            <TextInput
                                label="Password"
                                type="password"
                                name="password"
                                isValid={isPasswordValid}
                                validation={validatePassword}
                                errorMessage="Please enter a password"
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
                </Panel>
                {flashMessages.error && flashMessages.error.length > 0
                    ? flashMessages.error.map((message, i) => (
                          <div
                              key={i}
                              className={styles.warningMessageContainer}
                          >
                              <WarningMessage>{message}</WarningMessage>
                          </div>
                      ))
                    : ""}
            </div>
        </div>
    )
}
