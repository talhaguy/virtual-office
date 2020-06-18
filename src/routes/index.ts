export { indexPageHandler } from "./indexPageRouteHandler"

import { Request, Response } from "express"
import { CreateUser, createUser } from "../databaseModels"
import {
    registerHandler as _registerHandler,
    OnUserSaveSuccessFunction,
    onUserSaveSuccess,
    OnUserSaveErrorFunction,
    onUserSaveError,
} from "./registerRouteHandlers"

export const registerHandler = ((
    createUser: CreateUser,
    onUserSaveSuccess: OnUserSaveSuccessFunction,
    onUserSaveError: OnUserSaveErrorFunction
) => (req: Request, res: Response) =>
    _registerHandler(createUser, onUserSaveSuccess, onUserSaveError, req, res))(
    createUser,
    onUserSaveSuccess,
    onUserSaveError
)

export { logoutHandler, isLoggedInHandler } from "./loginRouteHandlers"

export { notFoundPageHandler } from "./notFoundPageHandler"
