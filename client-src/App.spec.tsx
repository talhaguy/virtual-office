import React from "react"
import { render } from "@testing-library/react"
import { App } from "./App"

describe("App", () => {
    it("should render `App...` text", () => {
        const component = render(<App />)
        const text = component.getByText(/App\.\.\./)
        expect(text).toBeInTheDocument()
    })
})
