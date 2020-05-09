import { Request, Response } from "express"

export function logoutHandler(req: Request, res: Response) {
    req.logout()
    res.redirect("/")
}

export function isLoggedInHandler(req: Request, res: Response) {
    res.json({
        loggedIn: req.isAuthenticated(),
    })
}
