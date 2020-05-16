import { Request, Response } from "express"
import { getOnlineUsersList } from "../socket"
import {
    ServerResponse,
    RepsonseStatusText,
    OnlineUser,
} from "../../shared-src/models"

export function clientDataHandler(req: Request, res: Response) {
    if (!req.isAuthenticated()) {
        const responseData: ServerResponse<{}> = {
            status: RepsonseStatusText.Error,
            data: {},
        }
        res.status(401).json(responseData)
        return
    }

    const onlineUsersList = getOnlineUsersList()
    const responseData: ServerResponse<OnlineUser[]> = {
        status: RepsonseStatusText.Success,
        data: onlineUsersList,
    }
    res.json(responseData)
}
