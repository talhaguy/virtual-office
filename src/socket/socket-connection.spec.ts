import { Socket, Server } from "socket.io"
import { Document } from "mongoose"
import {
    deserializeUserSuccessFactory,
    deserializeUserError,
    constructClientDataSuccessFactory,
    OnConnectionFunction,
    onConnectionFactory,
} from "./socket-connection"
import { User } from "../models"
import {
    UserColor,
    RoomTitlePosition,
    ClientData,
} from "../../shared-src/models"
import { RoomType, IOEvents } from "../../shared-src/constants"
import { Door } from "../models/Room"

describe("socket-connection", () => {
    const clientData: ClientData = {
        currentUser: {
            username: "user@site.com",
            roomId: "some-room",
            color: UserColor.Blue,
        },
        onlineUsers: [
            {
                username: "user@site.com",
                roomId: "some-room",
                color: UserColor.Blue,
            },
        ],
        rooms: [
            {
                id: "some-room",
                name: "Some Room",
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

    describe("deserializeUserSuccessFactory()", () => {
        it("should add a user to the state, join the desksRoom, and return the promise constructClientData function", (done) => {
            const addOnlineUser = jest.fn()
            const constructClientData = jest
                .fn()
                .mockResolvedValue("value from constructClientData")

            const deserializeUserSuccess = deserializeUserSuccessFactory(
                addOnlineUser,
                constructClientData
            )
            const socket = ({
                join: jest.fn(),
            } as unknown) as Socket
            const user = ({
                username: "user@site.com",
            } as unknown) as User & Document
            const userId = "12345"

            const promise = deserializeUserSuccess(socket, user, userId)
            promise.then((value) => {
                expect(value).toBe("value from constructClientData")
                done()
            })

            expect(addOnlineUser).toBeCalledWith(userId, {
                username: user.username,
                roomId: "desksRoom",
            })
            expect(socket.join).toBeCalledWith("desksRoom")
        })
    })

    describe("deserializeUserError()", () => {
        jest.spyOn(console, "error").mockImplementation(() => {
            return
        })

        beforeEach(() => {
            jest.clearAllMocks()
        })

        it("should log an error to the console", () => {
            const error = new Error("some error")
            deserializeUserError(error)
            expect(console.error).toHaveBeenCalledWith(error)
        })
    })

    describe("constructClientDataSuccessFactory()", () => {
        it("should emit online users change io event with client data", () => {
            const io = ({
                emit: jest.fn(),
            } as unknown) as Server
            const constructClientDataSuccess = constructClientDataSuccessFactory(
                io
            )

            constructClientDataSuccess(clientData)

            expect(io.emit).toBeCalledWith(IOEvents.OnlineUsersChange, {
                data: clientData,
            })
        })
    })

    describe("onConnectionFactory()", () => {
        let deserializeUser: jest.Mock<any, any>
        let deserializeUserSuccess: jest.Mock<any, any>
        let deserializeError: Error
        let deserializeUserError: jest.Mock<any, any>
        let constructClientDataSuccess: jest.Mock<any, any>
        let onSocketDisconnect: jest.Mock<any, any>
        let onUserJoinedRoom: jest.Mock<any, any>
        let onUserChat: jest.Mock<any, any>
        let onConnection: OnConnectionFunction

        const setUpOnConnection = (
            shouldDeserializeUserResolve: boolean,
            deserializeUserErrorImpl: (...args: any) => any,
            constructClientDataSuccessImpl: (...args: any) => any
        ) => {
            deserializeUserSuccess = jest.fn().mockResolvedValue(clientData)
            deserializeError = new Error("deserialize error")
            deserializeUserError = jest
                .fn()
                .mockImplementation(deserializeUserErrorImpl)
            constructClientDataSuccess = jest
                .fn()
                .mockImplementation(constructClientDataSuccessImpl)
            onSocketDisconnect = jest.fn()
            onUserJoinedRoom = jest.fn()
            onUserChat = jest.fn()

            if (shouldDeserializeUserResolve) {
                deserializeUser = jest.fn().mockResolvedValue({
                    username: "user@site.com",
                    password: "some-password",
                } as User & Document)
            } else {
                deserializeUser = jest.fn().mockRejectedValue(deserializeError)
            }

            onConnection = onConnectionFactory(
                deserializeUser,
                deserializeUserSuccess,
                deserializeUserError,
                constructClientDataSuccess,
                onSocketDisconnect,
                onUserJoinedRoom,
                onUserChat
            )
        }

        beforeEach(() => {
            jest.clearAllMocks()
            setUpOnConnection(
                true,
                () => {
                    return
                },
                () => {
                    return
                }
            )
        })

        it("should not continue if passport key is not in session", () => {
            const socket = ({
                request: {
                    session: {},
                },
                on: jest.fn(),
            } as unknown) as Socket
            onConnection(socket)

            expect(deserializeUser).not.toBeCalled()
            expect(socket.on).not.toBeCalled()
        })

        it("should deserialize user by id and run the deserialize user error callback on error", (done) => {
            setUpOnConnection(
                false,
                () => {
                    expect(deserializeUserError).toBeCalledWith(
                        deserializeError
                    )
                    done()
                },
                () => {
                    return
                }
            )

            const socket = ({
                request: {
                    session: {
                        passport: {
                            user: "12345",
                        },
                    },
                },
                on: jest.fn(),
            } as unknown) as Socket
            onConnection(socket)

            expect(deserializeUser).toBeCalledWith("12345")
        })

        it("should deserialize user by id and attach socket event listeners for disconnect, user joined room, and user chat", (done) => {
            const socket = ({
                request: {
                    session: {
                        passport: {
                            user: "12345",
                        },
                    },
                },
                on: jest.fn(),
            } as unknown) as Socket

            setUpOnConnection(
                true,
                () => {
                    return
                },
                () => {
                    expect(deserializeUserSuccess).toBeCalledWith(
                        socket,
                        {
                            username: "user@site.com",
                            password: "some-password",
                        },
                        "12345"
                    )
                    expect(constructClientDataSuccess).toBeCalledWith(
                        clientData
                    )
                    done()
                }
            )

            onConnection(socket)

            expect(deserializeUser).toBeCalledWith("12345")

            // check onSocketDisconnect callback
            expect(onSocketDisconnect).not.toBeCalled()
            expect((socket.on as jest.Mock<any, any>).mock.calls[0][0]).toBe(
                "disconnect"
            )
            ;(socket.on as jest.Mock<any, any>).mock.calls[0][1]()
            expect(onSocketDisconnect).toBeCalledWith("12345")

            // check onUserJoinedRoom callback
            expect(onUserJoinedRoom).not.toBeCalled()
            expect((socket.on as jest.Mock<any, any>).mock.calls[1][0]).toBe(
                IOEvents.UserJoinedRoom
            )
            ;(socket.on as jest.Mock<any, any>).mock.calls[1][1]({
                data: {
                    previousRoomId: "old-room",
                    newRoomId: "new-room",
                },
            })
            expect(onUserJoinedRoom).toBeCalledWith(
                {
                    data: {
                        previousRoomId: "old-room",
                        newRoomId: "new-room",
                    },
                },
                socket,
                "12345"
            )

            // check onUserChat callback
            expect(onUserChat).not.toBeCalled()
            expect((socket.on as jest.Mock<any, any>).mock.calls[2][0]).toBe(
                IOEvents.UserChat
            )
            ;(socket.on as jest.Mock<any, any>).mock.calls[2][1]({
                data: {
                    roomId: "some-id",
                    message: "this is a message",
                },
            })
            expect(onUserChat).toBeCalledWith(
                {
                    data: {
                        roomId: "some-id",
                        message: "this is a message",
                    },
                },
                "12345"
            )
        })
    })
})
