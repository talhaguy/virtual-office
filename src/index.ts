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
import socketIO from "socket.io"

import { PROJECT_ROOT_PATH } from "./constants"
import { verifyFunction, serializeUser, deserializeUser } from "./authorization"
import { connect } from "./database"
import {
    indexPageHandler,
    registerHandler,
    logoutHandler,
    isLoggedInHandler,
    notFoundPageHandler,
} from "./routes"
import { registrationValidation } from "./middleware"

// MARK: Database start

connect()

// MARK: Set up express

const app = express()
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
app.set("views", `${PROJECT_ROOT_PATH}/src/views`)
app.set("view engine", "ejs")

// MARK: Setup Passport

passport.use(new Strategy(verifyFunction))
passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)

app.use(passport.initialize())
app.use(passport.session())

// MARK: Configure route handlers

app.get("/", indexPageHandler)
app.get("/register", indexPageHandler)
app.get("/login", indexPageHandler)
app.get("/main", ensureLoggedIn({ redirectTo: "/login" }), indexPageHandler)

app.post("/register", registrationValidation, registerHandler)
app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/main",
        failureRedirect: "/login",
        failureFlash: true,
    })
)
app.post("/logout", logoutHandler)
app.post("/isLoggedIn", isLoggedInHandler)

app.use(express.static("public"))

app.get("*", notFoundPageHandler, indexPageHandler)

// MARK: Start server

const server = app.listen(process.env.PORT, (err) => {
    if (err) {
        return console.error(err)
    }

    return console.log(`Server is listening on ${process.env.PORT}`)
})

// MARK: Set up Socket.IO

const io = socketIO(server)

io.on("connection", (socket) => {
    console.log("a user connected")

    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
})
