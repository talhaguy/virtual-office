import React from "react"
import { render } from "@testing-library/react"
import { LoginPage } from "./LoginPage"
import { DependenciesContext } from "../../DependenciesContext"
import { InitialClientData } from "../../../shared-src/models"
import { validatePassword, validateEmail } from "../../../shared-src/validation"
import { BrowserRouter, Switch, Route } from "react-router-dom"

describe("LoginPage", () => {
    fit("should show an error if you click login without providing credentials", () => {
        const initialClientData: InitialClientData = {
            flashMessages: {},
        }
        const dependencies = {
            initialClientData,
            validation: {
                validatePassword,
                validateEmail,
            },
        }

        const component = render(
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

        const loginButton = component.getByRole("button")
        expect(loginButton).toBeInTheDocument()
    })
})
