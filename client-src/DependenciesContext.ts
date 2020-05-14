import React from "react"
import { InitialClientData } from "../shared-src/models"

declare const INITIAL_CLIENT_DATA: InitialClientData

export const DependenciesContext = React.createContext(INITIAL_CLIENT_DATA)
