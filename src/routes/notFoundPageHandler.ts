import { Request, Response, NextFunction } from "express"

export function notFoundPageHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.status(404)
    next()
}
