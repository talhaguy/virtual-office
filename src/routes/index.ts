export { indexPageHandler } from "./indexPageRouteHandler"

import { Request, Response } from "express"
import { CreateUser, createUser } from "../databaseModels"
import {
    registerHandler as _registerHandler,
    onUserSaveSuccess,
    onUserSaveError,
} from "./registerRouteHandlers"

export const registerHandler = ((
    createUser: CreateUser,
    onUserSaveSuccess: (req: Request, res: Response) => void,
    onUserSaveError: (req: Request, res: Response, err: any) => void
) => (req: Request, res: Response) =>
    _registerHandler(createUser, onUserSaveSuccess, onUserSaveError, req, res))(
    createUser,
    onUserSaveSuccess,
    onUserSaveError
)

export { logoutHandler, isLoggedInHandler } from "./loginRouteHandlers"

export { notFoundPageHandler } from "./notFoundPageHandler"

export { clientDataHandler } from "./clientDataRouteHandler"
