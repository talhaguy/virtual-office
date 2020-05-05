import dotenv from "dotenv"
import express from "express"
import expressSession from "express-session"
import passport from "passport"
import { Strategy } from "passport-local"
import { urlencoded } from "body-parser"
import { ensureLoggedIn } from "connect-ensure-login"
import morgan from "morgan"
import mongoose from "mongoose"

import {
    loginGetHandler,
    loginPostHandler,
    logoutHandler,
    isLoggedInHandler,
} from "./loginRouteHandlers"
import { verifyFunction, serializeUser, deserializeUser } from "./localStrategy"
import { myAccountPageHandler } from "./accountRouteHandlers"
import { homepageHandler } from "./homepageRouteHandlers"
import { connect } from "./database"

// MARK: Environment variable config

dotenv.config()

// MARK: Database start

connect(mongoose)

// MARK: Set up express

const app = express()
app.use(morgan("combined"))
app.use(urlencoded({ extended: true }))
app.use(
    expressSession({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
)

// MARK: Setup Passport

passport.use(new Strategy(verifyFunction))
passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)

app.use(passport.initialize())
app.use(passport.session())

// MARK: Configure route handlers

app.get("/", homepageHandler)
app.get("/login", loginGetHandler)
app.get("/my-account", ensureLoggedIn(), myAccountPageHandler)

app.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/login" }),
    loginPostHandler
)
app.post("/logout", logoutHandler)
app.post("/isLoggedIn", isLoggedInHandler)

// MARK: Start server

app.listen(process.env.PORT, (err) => {
    if (err) {
        return console.error(err)
    }

    return console.log(`Server is listening on ${process.env.PORT}`)
})
