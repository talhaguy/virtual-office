import { Response, Request } from "express"
import { InitialClientData } from "../../shared-src/models"

export function indexPageHandler(req: Request, res: Response) {
    const data: InitialClientData = {
        flashMessages: req.flash(),
    }

    const user = req.user as { username: string }
    if (user && user.username) {
        data.username = user.username
    }

    res.render("index", data)
}
