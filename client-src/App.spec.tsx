import React from "react"
import { render } from "@testing-library/react"
import { App } from "./App"
import { DependenciesContext } from "./DependenciesContext"
import { InitialClientData } from "../shared-src/models"
import { mock, instance, resetCalls } from "ts-mockito"

describe("App", () => {
    const initialClientDataMock = mock<InitialClientData>()
    const initialClientData = instance(initialClientDataMock)

    beforeEach(() => {
        resetCalls(initialClientDataMock)
    })

    it("should render `App...` text", () => {
        initialClientData.username = null
        const component = render(
            <DependenciesContext.Provider value={initialClientData}>
                <App />
            </DependenciesContext.Provider>
        )

        const text = component.getByText(/Log in/)
        expect(text).toBeInTheDocument()
    })
})
