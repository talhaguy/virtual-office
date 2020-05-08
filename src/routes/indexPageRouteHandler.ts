import { Response, Request } from "express"

export function indexPageHandler(
    pathToIndex: string,
    req: Request,
    res: Response
) {
    res.sendFile(pathToIndex)
}
