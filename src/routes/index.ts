import { indexPageHandler as _indexPageHandler } from "./indexPageRouteHandler"
import { Request, Response } from "express"

export const indexPageHandler = ((pathToIndex: string) => (
    req: Request,
    res: Response
) => _indexPageHandler(pathToIndex, req, res))(
    `${process.env["ROOT_PROJECT_PATH"]}/${process.env["PUBLIC_DIR"]}/index.html`
)

export { registerHandler } from "./registerRouteHandlers"
export { logoutHandler, isLoggedInHandler } from "./loginRouteHandlers"
