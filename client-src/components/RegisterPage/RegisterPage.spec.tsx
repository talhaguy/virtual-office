import React from "react"
import { render } from "@testing-library/react"
import { DependenciesContext, Dependencies } from "../../DependenciesContext"
import { InitialClientData } from "../../../shared-src/models"
import { validatePassword, validateEmail } from "../../../shared-src/validation"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import { ErrorMessages } from "../../constants/messages"
import { RegisterPage } from "./RegisterPage"

describe("RegisterPage", () => {
    const setUpComponent = (dependencies: Dependencies) => {
        return render(
            <DependenciesContext.Provider value={dependencies}>
                <BrowserRouter>
                    <Switch>
                        <Route path="*">
                            <RegisterPage />
                        </Route>
                    </Switch>
                </BrowserRouter>
            </DependenciesContext.Provider>
        )
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should only allow register submit if valid credentials are provided", () => {
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
            /username/i
        ) as HTMLInputElement
        const passwordInput = component.getByLabelText(
            /^password$/i
        ) as HTMLInputElement
        const checkPasswordInput = component.getByLabelText(
            /^re-enter password$/i
        ) as HTMLInputElement
        const registerButton = component.getByRole("button")

        // error messages should NOT be visible
        let emailError = component.queryByText(ErrorMessages.EmailPattern)
        let passwordErrors = component.queryAllByText(
            // contains both password and check password error messages
            ErrorMessages.PasswordPattern
        )
        expect(emailError).toBeNull()
        expect(passwordErrors).toHaveLength(0)

        // click register button
        registerButton.click()

        // error messages should be visible
        emailError = component.queryByText(ErrorMessages.EmailPattern)
        passwordErrors = component.queryAllByText(ErrorMessages.PasswordPattern)
        expect(emailError).toBeInTheDocument()
        expect(passwordErrors[0]).toBeInTheDocument()
        expect(passwordErrors[1]).toBeInTheDocument()

        // fill invalid username
        usernameInput.value = "user"
        registerButton.click()

        // error messages should be visible
        emailError = component.getByText(ErrorMessages.EmailPattern)
        passwordErrors = component.queryAllByText(ErrorMessages.PasswordPattern)
        expect(emailError).toBeInTheDocument()
        expect(passwordErrors[0]).toBeInTheDocument()
        expect(passwordErrors[1]).toBeInTheDocument()

        // fill in valid username
        usernameInput.value = "user@site.com"
        registerButton.click()

        // password error message should be visible
        emailError = component.queryByText(ErrorMessages.EmailPattern)
        passwordErrors = component.queryAllByText(ErrorMessages.PasswordPattern)
        expect(emailError).toBeNull()
        expect(passwordErrors[0]).toBeInTheDocument()
        expect(passwordErrors[1]).toBeInTheDocument()

        // fill invalid password (clear username too)
        usernameInput.value = ""
        passwordInput.value = "1234"
        registerButton.click()

        // error messages should be visible
        emailError = component.getByText(ErrorMessages.EmailPattern)
        passwordErrors = component.queryAllByText(ErrorMessages.PasswordPattern)
        let passwordMismatchError = component.queryByText(
            ErrorMessages.RegisterPasswordMismatch
        )
        expect(emailError).toBeInTheDocument()
        expect(passwordErrors[0]).toBeInTheDocument()
        expect(passwordErrors[1]).toBeInTheDocument()
        expect(passwordMismatchError).toBeInTheDocument()

        // fill in valid password
        passwordInput.value = "somepassword"
        registerButton.click()

        // username and check password error message should be visible
        emailError = component.getByText(ErrorMessages.EmailPattern)
        passwordErrors = component.queryAllByText(ErrorMessages.PasswordPattern)
        passwordMismatchError = component.queryByText(
            ErrorMessages.RegisterPasswordMismatch
        )
        expect(emailError).toBeInTheDocument()
        expect(passwordErrors).toHaveLength(1)
        expect(passwordErrors[0]).toBeInTheDocument()
        expect(passwordMismatchError).toBeInTheDocument()

        // fill invalid check password (clear out username and password too)
        usernameInput.value = ""
        passwordInput.value = ""
        checkPasswordInput.value = "1234"
        registerButton.click()

        // error messages should be visible
        emailError = component.getByText(ErrorMessages.EmailPattern)
        passwordErrors = component.queryAllByText(ErrorMessages.PasswordPattern)
        passwordMismatchError = component.queryByText(
            ErrorMessages.RegisterPasswordMismatch
        )
        expect(emailError).toBeInTheDocument()
        expect(passwordErrors[0]).toBeInTheDocument()
        expect(passwordErrors[1]).toBeInTheDocument()
        expect(passwordMismatchError).toBeInTheDocument()

        // fill in valid check password
        checkPasswordInput.value = "somepassword"
        registerButton.click()

        // username and password error message should be visible
        emailError = component.getByText(ErrorMessages.EmailPattern)
        passwordErrors = component.queryAllByText(ErrorMessages.PasswordPattern)
        passwordMismatchError = component.queryByText(
            ErrorMessages.RegisterPasswordMismatch
        )
        expect(emailError).toBeInTheDocument()
        expect(passwordErrors).toHaveLength(1)
        expect(passwordErrors[0]).toBeInTheDocument()
        expect(passwordMismatchError).toBeInTheDocument()

        // fill in mismatched passwords
        passwordInput.value = "somepassword"
        checkPasswordInput.value = "someotherpassword"
        registerButton.click()

        // username and password mistach error message should be visible
        emailError = component.getByText(ErrorMessages.EmailPattern)
        passwordErrors = component.queryAllByText(ErrorMessages.PasswordPattern)
        passwordMismatchError = component.queryByText(
            ErrorMessages.RegisterPasswordMismatch
        )
        expect(emailError).toBeInTheDocument()
        expect(passwordErrors).toHaveLength(0)
        expect(passwordMismatchError).toBeInTheDocument()

        // fill in valid credentials
        expect(dependencies.form.submitHtmlForm).not.toHaveBeenCalled()
        usernameInput.value = "user@site.com"
        passwordInput.value = "somepassword"
        checkPasswordInput.value = "somepassword"
        registerButton.click()

        // form should be submitted
        emailError = component.queryByText(ErrorMessages.EmailPattern)
        passwordErrors = component.queryAllByText(ErrorMessages.PasswordPattern)
        passwordMismatchError = component.queryByText(
            ErrorMessages.RegisterPasswordMismatch
        )
        expect(emailError).toBeNull()
        expect(passwordErrors).toHaveLength(0)
        expect(passwordMismatchError).toBeNull()
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
