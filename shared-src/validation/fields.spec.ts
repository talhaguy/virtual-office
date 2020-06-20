import { validateEmail, validatePassword } from "./fields"

describe("fields", () => {
    describe("validateEmail()", () => {
        it("should validate email pattern", () => {
            expect(validateEmail("user")).toBeFalsy()
            expect(validateEmail("@site.com")).toBeFalsy()
            expect(validateEmail("")).toBeFalsy()
            expect(validateEmail("user @ site . com")).toBeFalsy()

            expect(validateEmail("user@site.com")).toBeTruthy()
            expect(validateEmail("one@two.co.uk")).toBeTruthy()
            expect(validateEmail("penguin_panda@animals.com")).toBeTruthy()
        })
    })

    describe("validatePassword()", () => {
        it("should validate that password is not empty and at least 6 characters", () => {
            expect(validatePassword("")).toBeFalsy()
            expect(validatePassword("a")).toBeFalsy()
            expect(validatePassword("987")).toBeFalsy()
            expect(validatePassword("f41j2")).toBeFalsy()

            expect(validatePassword("lkjh7e")).toBeTruthy()
            expect(validatePassword("akjsdh78234j")).toBeTruthy()
            expect(validatePassword("ytuir454356f584gjioas")).toBeTruthy()
        })
    })
})
