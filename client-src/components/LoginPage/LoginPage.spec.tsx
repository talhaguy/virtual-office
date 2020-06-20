import React from "react"
import { render } from "@testing-library/react"
import { LoginPage } from "./LoginPage"
import { DependenciesContext, Dependencies } from "../../DependenciesContext"
import { InitialClientData } from "../../../shared-src/models"
import { validatePassword, validateEmail } from "../../../shared-src/validation"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import { ErrorMessages } from "../../constants/messages"

describe("LoginPage", () => {
    const setUpComponent = (dependencies: Dependencies) => {
        return render(
            <DependenciesContext.Provider value={dependencies}>
                <BrowserRouter>
                    <Switch>
                        <Route path="*">
                            <LoginPage />
                        </Route>
                    </Switch>
                </BrowserRouter>
            </DependenciesContext.Provider>
        )
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should only allow login submit if valid credentials are provided", () => {
        const initialClientData: InitialClientData = {
            flashMessages: {},
        }
        const dependencies: Dependencies = {
            initialClientData,
            validation: {
                validatePassword,
                validateEmail,
            },
            form: {
                submitHtmlForm: jest.fn(),
            },
        }

        const component = setUpComponent(dependencies)

        const usernameInput = component.getByLabelText(
            /Username/
        ) as HTMLInputElement
        const passwordInput = component.getByLabelText(
            /Password/
        ) as HTMLInputElement

        // error messages should NOT be visible
        let emailError = component.queryByText(ErrorMessages.EmailPattern)
        let passwordError = component.queryByText(ErrorMessages.PasswordPattern)
        expect(emailError).toBeNull()
        expect(passwordError).toBeNull()

        // click login button
        const loginButton = component.getByRole("button")
        loginButton.click()

        // error messages should be visible
        emailError = component.getByText(ErrorMessages.EmailPattern)
        passwordError = component.getByText(ErrorMessages.PasswordPattern)
        expect(emailError).toBeInTheDocument()
        expect(passwordError).toBeInTheDocument()

        // fill invalid username
        usernameInput.value = "user"
        loginButton.click()

        // error messages should be visible
        emailError = component.getByText(ErrorMessages.EmailPattern)
        passwordError = component.getByText(ErrorMessages.PasswordPattern)
        expect(emailError).toBeInTheDocument()
        expect(passwordError).toBeInTheDocument()

        // fill in valid username
        usernameInput.value = "user@site.com"
        loginButton.click()

        // password error message should be visible
        emailError = component.queryByText(ErrorMessages.EmailPattern)
        passwordError = component.getByText(ErrorMessages.PasswordPattern)
        expect(emailError).toBeNull()
        expect(passwordError).toBeInTheDocument()

        // fill invalid password (clear username too)
        usernameInput.value = ""
        passwordInput.value = "1234"
        loginButton.click()

        // error messages should be visible
        emailError = component.getByText(ErrorMessages.EmailPattern)
        passwordError = component.getByText(ErrorMessages.PasswordPattern)
        expect(emailError).toBeInTheDocument()
        expect(passwordError).toBeInTheDocument()

        // fill in valid password
        passwordInput.value = "somepassword"
        loginButton.click()

        // username error message should be visible
        emailError = component.getByText(ErrorMessages.EmailPattern)
        passwordError = component.queryByText(ErrorMessages.PasswordPattern)
        expect(emailError).toBeInTheDocument()
        expect(passwordError).toBeNull()

        // fill in valid credentials
        expect(dependencies.form.submitHtmlForm).not.toHaveBeenCalled()
        usernameInput.value = "user@site.com"
        passwordInput.value = "somepassword"
        loginButton.click()

        // form should be submitted
        emailError = component.queryByText(ErrorMessages.EmailPattern)
        passwordError = component.queryByText(ErrorMessages.PasswordPattern)
        expect(emailError).toBeNull()
        expect(passwordError).toBeNull()
        expect(dependencies.form.submitHtmlForm).toHaveBeenCalled()
    })

    it("should show info flash message if present", () => {
        const initialClientData: InitialClientData = {
            flashMessages: {
                info: ["This is an info message"],
            },
        }
        const dependencies: Dependencies = {
            initialClientData,
            validation: {
                validatePassword,
                validateEmail,
            },
            form: {
                submitHtmlForm: jest.fn(),
            },
        }

        const component = setUpComponent(dependencies)

        const message = component.getByText("This is an info message")
        expect(message).toBeInTheDocument()
    })
})
