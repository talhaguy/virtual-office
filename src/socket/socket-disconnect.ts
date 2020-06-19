import { Server } from "socket.io"
import { RemoveOnlineUserFunction, ConstructClientDataFunction } from "./index"
import { IOEventResponseData, ClientData } from "../../shared-src/models"
import { IOEvents } from "../../shared-src/constants"

// MARK: socketDisconnectConstructClientDataSuccessFactory

interface SocketDisconnectConstructClientDataSuccessFactoryFunction {
    (io: Server): SocketDisconnectConstructClientDataSuccessFunction
}

interface SocketDisconnectConstructClientDataSuccessFunction {
    (clientData: ClientData): void
}

export const socketDisconnectConstructClientDataSuccessFactory: SocketDisconnectConstructClientDataSuccessFactoryFunction = (
    io
) => (clientData) => {
    const data: IOEventResponseData<ClientData> = {
        data: clientData,
    }
    io.emit(IOEvents.OnlineUsersChange, data)
}

// MARK: onSocketDisconnectFactory

interface OnSocketDisconnectFactoryFunction {
    (
        removeOnlineUser: RemoveOnlineUserFunction,
        constructClientData: ConstructClientDataFunction,
        onSocketDisconnectConstructClientDataSuccess: SocketDisconnectConstructClientDataSuccessFunction
    ): OnSocketDisconnectFunction
}

export interface OnSocketDisconnectFunction {
    (userId: string): void
}

export const onSocketDisconnectFactory: OnSocketDisconnectFactoryFunction = (
    removeOnlineUser,
    constructClientData,
    onSocketDisconnectConstructClientDataSuccess
) => (userId) => {
    removeOnlineUser(userId)

    constructClientData(userId)
        .then((clientData) => {
            onSocketDisconnectConstructClientDataSuccess(clientData)
        })
        .catch((error) => {
            console.error(error)
        })
}
