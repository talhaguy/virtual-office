import { VerifyFunction } from "passport-local"
import { User } from "./models/User"

const mockUser = {
    id: "12345",
    username: "a@a.com",
    password: "asdfasdf",
}

export const verifyFunction: VerifyFunction = (username, password, done) => {
    console.log("In local strategy; got ", username, password)

    // TODO: get user from db using username and authenticate
    done(null, mockUser)
}

interface SerializeUser {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (user: User, done: (err: any, id?: string) => void): void
}

export const serializeUser: SerializeUser = (user, cb) => {
    console.log("In serializeUser")

    cb(null, user.id)
}

interface DeserializeUser {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (id: string, done: (err: any, user?: User) => void): void
}

export const deserializeUser: DeserializeUser = (id, cb) => {
    console.log("In deserializeUser; id ", id)

    // TODO: get user from db using id
    cb(null, mockUser)
}
