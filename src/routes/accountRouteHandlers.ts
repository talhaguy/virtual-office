import { Request, Response } from "express"

export function myAccountPageHandler(req: Request, res: Response) {
    // TODO: need to handle for production build; send js app
    res.send("My Account Page")
}
