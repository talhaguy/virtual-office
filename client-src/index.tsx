import React from "react"
import ReactDOM from "react-dom"

import { InitialClientData } from "../shared-src/models"
import { DependenciesContext } from "./DependenciesContext"
import { App } from "./components/App"

import "./index.css"

declare const INITIAL_CLIENT_DATA: InitialClientData

ReactDOM.render(
    <DependenciesContext.Provider value={INITIAL_CLIENT_DATA}>
        <App />
    </DependenciesContext.Provider>,
    document.getElementById("root")
)
