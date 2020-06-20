import {
    socketDisconnectConstructClientDataSuccessFactory,
    onSocketDisconnectFactory,
} from "./socket-disconnect"
import { Server } from "socket.io"
import {
    UserColor,
    ClientData,
    RoomTitlePosition,
} from "../../shared-src/models"
import { Door } from "../models/Room"
import { RoomType, IOEvents } from "../../shared-src/constants"

describe("socket-disconnect", () => {
    const user = {
        username: "user@site.com",
        roomId: "old-room",
        color: UserColor.Blue,
    }

    const clientData: ClientData = {
        currentUser: user,
        onlineUsers: [user],
        rooms: [
            {
                id: "old-room",
                name: "Old Room",
                gridColStart: 0,
                gridColEnd: 1,
                gridRowStart: 0,
                gridRowEnd: 1,
                doors: [] as Door[],
                titlePosition: RoomTitlePosition.Bottom,
                roomType: RoomType.MeetingRoom,
                users: [
                    {
                        username: "user@site.com",
                        color: UserColor.Blue,
                    },
                ],
            },
            {
                id: "new-room",
                name: "New Room",
                gridColStart: 0,
                gridColEnd: 1,
                gridRowStart: 0,
                gridRowEnd: 1,
                doors: [] as Door[],
                titlePosition: RoomTitlePosition.Bottom,
                roomType: RoomType.MeetingRoom,
                users: [
                    {
                        username: "user@site.com",
                        color: UserColor.Blue,
                    },
                ],
            },
        ],
    }

    describe("socketDisconnectConstructClientDataSuccessFactory()", () => {
        it("should emit online users change io event with client data", () => {
            const io = ({
                emit: jest.fn(),
            } as unknown) as Server
            const socketDisconnectConstructClientDataSuccess = socketDisconnectConstructClientDataSuccessFactory(
                io
            )

            socketDisconnectConstructClientDataSuccess(clientData)

            expect(io.emit).toHaveBeenCalledWith(IOEvents.OnlineUsersChange, {
                data: clientData,
            })
        })
    })

    describe("onSocketDisconnectFactory()", () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        it("should run the removeOnlineUser function, the constructClientData function, and log an error to the console on constructClientData error", (done) => {
            const error = new Error("constructClientData error")
            jest.spyOn(console, "error").mockImplementation(() => {
                expect(console.error).toBeCalledWith(error)
                done()
            })
            const removeOnlineUser = jest.fn()
            const constructClientData = jest.fn().mockRejectedValue(error)
            const onSocketDisconnectConstructClientDataSuccess = jest.fn()

            const onSocketDisconnect = onSocketDisconnectFactory(
                removeOnlineUser,
                constructClientData,
                onSocketDisconnectConstructClientDataSuccess
            )

            const userId = "12345"
            onSocketDisconnect(userId)

            expect(removeOnlineUser).toBeCalledWith(userId)
        })

        it("should run the removeOnlineUser function, the constructClientData function, and run the onSocketDisconnectConstructClientDataSuccess function on constructClientData success", (done) => {
            const removeOnlineUser = jest.fn()
            const constructClientData = jest.fn().mockResolvedValue(clientData)
            const onSocketDisconnectConstructClientDataSuccess = jest
                .fn()
                .mockImplementation(() => {
                    expect(
                        onSocketDisconnectConstructClientDataSuccess
                    ).toBeCalledWith(clientData)
                    done()
                })

            const onSocketDisconnect = onSocketDisconnectFactory(
                removeOnlineUser,
                constructClientData,
                onSocketDisconnectConstructClientDataSuccess
            )

            const userId = "12345"
            onSocketDisconnect(userId)

            expect(removeOnlineUser).toBeCalledWith(userId)
        })
    })
})
