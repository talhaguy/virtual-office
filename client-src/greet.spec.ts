import { greet } from "./greet"

describe("greet", () => {
    it("should return greeting", () => {
        const result = greet("Talha")
        expect(result).toBe("hello, Talha")
    })
})
