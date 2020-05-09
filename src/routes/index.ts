import { Request, Response } from "express"
import { PROJECT_ROOT_PATH, PUBLIC_DIR } from "../constants"
import { CreateUser, createUser } from "../databaseModels"
import { indexPageHandler as _indexPageHandler } from "./indexPageRouteHandler"
import {
    registerHandler as _registerHandler,
    onUserSaveSuccess,
    onUserSaveError,
} from "./registerRouteHandlers"

export const indexPageHandler = ((pathToIndex: string) => (
    req: Request,
    res: Response
) => _indexPageHandler(pathToIndex, req, res))(
    `${PROJECT_ROOT_PATH}/${PUBLIC_DIR}/index.html`
)

export const registerHandler = ((
    createUser: CreateUser,
    onUserSaveSuccess: (res: Response) => void,
    onUserSaveError: (res: Response, err: any) => void
) => (req: Request, res: Response) =>
    _registerHandler(createUser, onUserSaveSuccess, onUserSaveError, req, res))(
    createUser,
    onUserSaveSuccess,
    onUserSaveError
)

export { logoutHandler, isLoggedInHandler } from "./loginRouteHandlers"
