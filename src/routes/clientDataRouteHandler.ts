import { Request, Response } from "express"
import { getOnlineUsersList } from "../socket"
import {
    ServerResponse,
    RepsonseStatusText,
    ClientData,
    RoomClientData,
} from "../../shared-src/models"
import { RoomModel } from "../databaseModels"

export function clientDataHandler(req: Request, res: Response) {
    if (!req.isAuthenticated()) {
        const responseData: ServerResponse<{}> = {
            status: RepsonseStatusText.Error,
            data: {},
        }
        res.status(401).json(responseData)
        return
    }

    RoomModel.find()
        .then((rooms) => {
            const onlineUsers = getOnlineUsersList()
            const roomData: RoomClientData[] = rooms.map((room) => {
                return {
                    id: room.name,
                    name: room.id,
                }
            })
            const responseData: ServerResponse<ClientData> = {
                status: RepsonseStatusText.Success,
                data: {
                    onlineUsers,
                    rooms: roomData,
                },
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
