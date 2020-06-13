import React from "react"
import { Link } from "react-router-dom"
import { Panel } from "../Panel"
import { TextInput } from "../TextInput"

import styles from "./LoginPage.module.css"
import { Button, ButtonSize, ButtonType } from "../Button"
import { FormRow, FormRowVerticalSpacing } from "../FormRow"
import { WarningMessage } from "../WarningMessage"

export const LoginPage = () => (
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
            <div className={styles.warningMessageContainer}>
                <WarningMessage>
                    Username or password is not correct
                </WarningMessage>
            </div>
        </div>
    </div>
)
