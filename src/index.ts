import express, { Request, Response } from "express"
import { greet } from "./greet"

const app = express()
const port = process.env.PORT || "8000"

app.get("/", (_req: Request, res: Response) => {
    return res.send(`Home page 🤓 - ${greet("Talha")}`)
})

app.listen(port, (err) => {
    if (err) return console.error(err)
    return console.log(`Server is listening on ${port}`)
})
