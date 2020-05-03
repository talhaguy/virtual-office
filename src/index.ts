import express, { Request, Response } from "express"
import expressSession from "express-session"
import passport from "passport"
import { Strategy } from "passport-local"
import { urlencoded } from "body-parser"
import { ensureLoggedIn } from "connect-ensure-login"
import morgan from "morgan"

const app = express()
const port = process.env.PORT || "8000"

const db = {
    users: {
        findByUsername(username: string, callback: Function) {
            callback(null, {
                id: "12345",
                username: "talhaguy",
                password: "mysecurepassword",
            })
        },
        findById(id: string, callback: Function) {
            callback(null, {
                id: "12345",
                username: "talhaguy",
                password: "mysecurepassword",
            })
        },
    },
}

passport.use(
    new Strategy(function (username, password, cb) {
        console.log("In local strategy; got ", username, password)

        db.users.findByUsername(username, function (err: any, user: any) {
            if (err) {
                return cb(err)
            }
            if (!user) {
                return cb(null, false)
            }
            if (user.password != password) {
                return cb(null, false)
            }
            return cb(null, user)
        })
    })
)

passport.serializeUser(function (user: any, cb: Function) {
    console.log("In serializeUser")

    cb(null, user.id)
})

passport.deserializeUser(function (id: string, cb: Function) {
    console.log("In deserializeUser; id ", id)

    db.users.findById(id, function (err: any, user: any) {
        if (err) {
            return cb(err)
        }
        cb(null, user)
    })
})

app.use(morgan("combined"))
app.use(urlencoded({ extended: true }))
app.use(
    expressSession({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
    })
)
app.use(passport.initialize())
app.use(passport.session())

app.get("/", (_req: Request, res: Response) => {
    return res.send(`Home page 🤓`)
})

app.get("/login", function (req, res) {
    res.send(`
    <html>
    <body>
    Log in:
    <form action="/login" method="POST">
    username: <input type="text" name="username"><br>
    password: <input type="text" name="password"><br>
    <button type="submit">Submit</button>
    </form>
    </body>
    </html>
    `)
})

app.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/login" }),
    function (req, res) {
        res.redirect("/restricted")
    }
)

app.post("/logout", function (req, res) {
    req.logout()
    res.redirect("/")
})

app.get("/restricted", ensureLoggedIn(), (_req: Request, res: Response) => {
    return res.send(`
    <html>
    <body>
    Log out:
    <form action="/logout" method="POST">
    <button type="submit">Log out</button>
    </form>
    </body>
    </html>
    `)
})

app.listen(port, (err) => {
    if (err) return console.error(err)
    return console.log(`Server is listening on ${port}`)
})
