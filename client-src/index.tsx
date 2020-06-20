import React from "react"
import ReactDOM from "react-dom"

import { InitialClientData } from "../shared-src/models"
import { validateEmail, validatePassword } from "../shared-src/validation"
import { submitHtmlForm } from "./helpers/form"
import { DependenciesContext, Dependencies } from "./DependenciesContext"
import { App } from "./components/App"

import "./index.css"

declare const INITIAL_CLIENT_DATA: InitialClientData

const dependencies: Dependencies = {
    initialClientData: INITIAL_CLIENT_DATA,
    validation: {
        validateEmail,
        validatePassword,
    },
    form: {
        submitHtmlForm,
    },
}

ReactDOM.render(
    <DependenciesContext.Provider value={dependencies}>
        <App />
    </DependenciesContext.Provider>,
    document.getElementById("root")
)
