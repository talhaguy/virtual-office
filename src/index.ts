// MARK: Environment variable config

import dotenv from "dotenv"
dotenv.config()

// MARK: Imports

import express from "express"
import expressSession from "express-session"
import passport from "passport"
import { Strategy } from "passport-local"
import { urlencoded, json } from "body-parser"
import { ensureLoggedIn } from "connect-ensure-login"
import flash from "connect-flash"
import morgan from "morgan"

import { verifyFunction, serializeUser, deserializeUser } from "./authorization"
import { connect } from "./database"
import {
    indexPageHandler,
    registerHandler,
    logoutHandler,
    isLoggedInHandler,
} from "./routes"
import { registrationValidation } from "./middleware"

// MARK: Database start

connect()

// MARK: Set up express

const app = express()
app.use(express.static("public"))
app.use(morgan("combined"))
app.use(urlencoded({ extended: true }))
app.use(json())
app.use(
    expressSession({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
)
app.use(flash())

// MARK: Setup Passport

passport.use(new Strategy(verifyFunction))
passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)

app.use(passport.initialize())
app.use(passport.session())

// MARK: Configure route handlers

app.get("/", indexPageHandler)
app.get("/login", indexPageHandler)
app.get("/my-account", ensureLoggedIn(), indexPageHandler)

app.post("/register", registrationValidation, registerHandler)
app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/my-account",
        failureRedirect: "/login",
        failureFlash: true,
    })
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
