import { Response, Request } from "express"
import { InitialClientData } from "../../shared-src/models/InitialClientData"

export function indexPageHandler(req: Request, res: Response) {
    const data: InitialClientData = {}

    const user = req.user as { username: string }
    if (user && user.username) {
        data.username = user.username
    }

    res.render("index", data)
}
