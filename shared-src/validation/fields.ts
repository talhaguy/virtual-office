import { RegexPatterns } from "../constants"

export interface ValidateEmailFunction {
    (email: string): boolean
}

export const validateEmail: ValidateEmailFunction = (email: string) => {
    const emailRegex = new RegExp(RegexPatterns.Email, "i")
    const isEmailValid = emailRegex.test(email)
    // setIsEmailValid(isEmailValid)
    return isEmailValid
}

export interface ValidatePasswordFunction {
    (password: string): boolean
}

export const validatePassword: ValidatePasswordFunction = (
    password: string
) => {
    const isPasswordValid = password !== ""
    // setIsPasswordValid(isPasswordValid)
    return isPasswordValid
}
