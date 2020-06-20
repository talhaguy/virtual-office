import React from "react"
import { InitialClientData } from "../shared-src/models"
import {
    ValidatePasswordFunction,
    ValidateEmailFunction,
} from "../shared-src/validation"
import { SubmitHtmlFormFunction } from "./helpers/form"

export interface Dependencies {
    initialClientData: InitialClientData
    validation: {
        validatePassword: ValidatePasswordFunction
        validateEmail: ValidateEmailFunction
    }
    form: {
        submitHtmlForm: SubmitHtmlFormFunction
    }
}

export const DependenciesContext = React.createContext<Dependencies>(null)
