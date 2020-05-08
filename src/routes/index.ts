import { Request, Response } from "express"
import { indexPageHandler as _indexPageHandler } from "./indexPageRouteHandler"
import { PROJECT_ROOT_PATH, PUBLIC_DIR } from "../constants"

export const indexPageHandler = ((pathToIndex: string) => (
    req: Request,
    res: Response
) => _indexPageHandler(pathToIndex, req, res))(
    `${PROJECT_ROOT_PATH}/${PUBLIC_DIR}/index.html`
)

export { registerHandler } from "./registerRouteHandlers"
export { logoutHandler, isLoggedInHandler } from "./loginRouteHandlers"
