import React, { useContext } from "react"
import { Link } from "react-router-dom"

import { Panel } from "../Panel"
import { TextInput } from "../TextInput"
import { Button, ButtonSize, ButtonType } from "../Button"
import { FormRow, FormRowVerticalSpacing } from "../FormRow"
import { WarningMessage } from "../WarningMessage"
import { DependenciesContext } from "../../DependenciesContext"

import styles from "./LoginPage.module.css"

export const LoginPage = () => {
    const { flashMessages } = useContext(DependenciesContext)

    return (
        <div className={styles.container}>
            <div className={styles.loginContainer}>
                <h1>Virtual Office</h1>
                <Panel title="Login">
                    <form action="/login" method="POST">
                        <FormRow>
                            <TextInput label="Username" name="username" />
                        </FormRow>
                        <FormRow>
                            <TextInput
                                label="Password"
                                type="password"
                                name="password"
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
