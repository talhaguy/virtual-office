import {
    userJoinedRoomConstructClientDataSuccessFactory,
    userJoinedRoomConstructClientDataError,
    onUserJoinedRoomFunctionFactory,
} from "./socket-user-joined-room"
import { Server, Socket } from "socket.io"
import {
    UserColor,
    RoomTitlePosition,
    ClientData,
    ChatMessageType,
    OnlineUser,
} from "../../shared-src/models"
import { Door } from "../models/Room"
import { RoomType, IOEvents } from "../../shared-src/constants"

describe("socket-user-joined-room", () => {
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

    const ioEventResponseData = {
        data: {
            previousRoomId: "old-room",
            newRoomId: "new-room",
        },
    }

    describe("userJoinedRoomConstructClientDataSuccessFactory()", () => {
        it("should emit an online users change event to the default namespace and a chat event to the old and new room namespace", () => {
            const emit = jest.fn()
            const io = ({
                emit: jest.fn(),
                to: jest.fn().mockImplementation(() => {
                    return {
                        emit,
                    }
                }),
            } as unknown) as Server
            const userJoinedRoomConstructClientDataSuccess = userJoinedRoomConstructClientDataSuccessFactory(
                io
            )

            userJoinedRoomConstructClientDataSuccess(
                clientData,
                ioEventResponseData,
                user
            )

            expect(io.emit).toBeCalledWith(IOEvents.OnlineUsersChange, {
                data: clientData,
            })

            expect((io.to as jest.Mock<any, any>).mock.calls[0][0]).toBe(
                "old-room"
            )
            expect(emit.mock.calls[0][0]).toBe(IOEvents.UserChat)
            expect(emit.mock.calls[0][1].data.type).toBe(ChatMessageType.Status)
            expect(emit.mock.calls[0][1].data.roomId).toBe("old-room")
            expect(emit.mock.calls[0][1].data.message).toBe(
                "user@site.com left old-room and joined new-room"
            )

            expect((io.to as jest.Mock<any, any>).mock.calls[1][0]).toBe(
                "new-room"
            )
            expect(emit.mock.calls[1][0]).toBe(IOEvents.UserChat)
            expect(emit.mock.calls[1][1].data.type).toBe(ChatMessageType.Status)
            expect(emit.mock.calls[1][1].data.roomId).toBe("new-room")
            expect(emit.mock.calls[1][1].data.message).toBe(
                "user@site.com left old-room and joined new-room"
            )
        })
    })

    describe("userJoinedRoomConstructClientDataError()", () => {
        beforeEach(() => {
            jest.spyOn(console, "error").mockImplementation(() => {
                return
            })
            jest.clearAllMocks()
        })

        it("should log an error to the console", () => {
            const error = new Error("some error")
            userJoinedRoomConstructClientDataError(error)
            expect(console.error).toBeCalledWith(error)
        })
    })

    describe("onUserJoinedRoomFunctionFactory()", () => {
        it("should run the userJoinedRoomConstructClientDataError callback on constructClientData error", (done) => {
            const getDataForUser = jest.fn()
            const updateUserRoom = jest.fn()
            const error = new Error("constructClientData error")
            const constructClientData = jest.fn().mockRejectedValue(error)
            const userJoinedRoomConstructClientDataSuccess = jest.fn()
            const userJoinedRoomConstructClientDataError = jest
                .fn()
                .mockImplementation(() => {
                    expect(
                        userJoinedRoomConstructClientDataError
                    ).toBeCalledWith(error)
                    done()
                })
            const onUserJoinedRoomFunction = onUserJoinedRoomFunctionFactory(
                getDataForUser,
                updateUserRoom,
                constructClientData,
                userJoinedRoomConstructClientDataSuccess,
                userJoinedRoomConstructClientDataError
            )

            const socket = ({
                leaveAll: jest.fn(),
                join: jest.fn(),
            } as unknown) as Socket
            const userId = "12345"
            onUserJoinedRoomFunction(ioEventResponseData, socket, userId)

            expect(constructClientData).toBeCalledWith(userId)
        })

        it("should leave all rooms, join the new room, and run the userJoinedRoomConstructClientDataSuccess callback", (done) => {
            const user: OnlineUser = {
                username: "user@site.com",
                roomId: "old-room",
                color: UserColor.Blue,
            }
            const getDataForUser = jest.fn().mockReturnValue(user)
            const updateUserRoom = jest.fn()
            const constructClientData = jest.fn().mockResolvedValue(clientData)
            const userJoinedRoomConstructClientDataSuccess = jest
                .fn()
                .mockImplementation(() => {
                    expect(
                        userJoinedRoomConstructClientDataSuccess
                    ).toBeCalledWith(clientData, ioEventResponseData, user)
                    done()
                })
            const userJoinedRoomConstructClientDataError = jest.fn()

            const onUserJoinedRoomFunction = onUserJoinedRoomFunctionFactory(
                getDataForUser,
                updateUserRoom,
                constructClientData,
                userJoinedRoomConstructClientDataSuccess,
                userJoinedRoomConstructClientDataError
            )

            const socket = ({
                leaveAll: jest.fn(),
                join: jest.fn(),
            } as unknown) as Socket
            const userId = "12345"
            onUserJoinedRoomFunction(ioEventResponseData, socket, userId)

            expect(socket.leaveAll).toBeCalled()
            expect(socket.join).toBeCalledWith("new-room")
            expect(updateUserRoom).toBeCalledWith(userId, "new-room")
            expect(constructClientData).toBeCalledWith(userId)
        })
    })
})
