import { Request, Response } from "express"
import { constructClientData } from "../socket"
import {
    ServerResponse,
    RepsonseStatusText,
    ClientData,
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

    constructClientData()
        .then((clientData) => {
            const responseData: ServerResponse<ClientData> = {
                status: RepsonseStatusText.Success,
                data: clientData,
            }
            res.json(responseData)
        })
        .catch((err) => {
            console.error(err)
            const responseData: ServerResponse<{}> = {
                status: RepsonseStatusText.Error,
                data: {},
            }
            res.status(500).json(responseData)
        })
}
