import { Request, Response } from "express"

export function loginGetHandler(req: Request, res: Response) {
    // TODO: need to handle for production build; send js app
    res.send("Login")
}

export function logoutHandler(req: Request, res: Response) {
    req.logout()
    res.redirect("/")
}

export function isLoggedInHandler(req: Request, res: Response) {
    return res.json({
        loggedIn: req.isAuthenticated(),
    })
}
