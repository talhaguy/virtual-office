import React from "react"
import { InitialClientData } from "../shared-src/models"
import {
    ValidatePasswordFunction,
    ValidateEmailFunction,
} from "../shared-src/validation"

export interface Dependencies {
    initialClientData: InitialClientData
    validation: {
        validatePassword: ValidatePasswordFunction
        validateEmail: ValidateEmailFunction
    }
}

export const DependenciesContext = React.createContext<Dependencies>(null)
