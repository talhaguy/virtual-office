import {
    addOnlineUser,
    State,
    getDataForUser,
    updateUserRoom,
    removeOnlineUser,
    getOnlineUsers,
    constructClientData,
    deserializeUser,
} from "./users"
import {
    OnlineUser,
    RoomTitlePosition,
    ClientData,
} from "../../shared-src/models"
import { userColorsList } from "./constants"
import { RoomModel, UserModel } from "../databaseModels"
import { RoomType } from "../../shared-src/constants"

jest.mock("../databaseModels", () => ({
    RoomModel: {
        find: jest.fn(),
    },
    UserModel: {
        findById: jest.fn(),
    },
}))

describe("users", () => {
    describe("addOnlineUser()", () => {
        it("should add a user to the state", () => {
            const key = "some-key"
            const username = "user@site.com"
            const roomId = "some-room"
            const onlineUserData: Pick<OnlineUser, "username" | "roomId"> = {
                username,
                roomId,
            }

            // regular currentIndex increment
            let state: State = {
                currentIndex: 3,
                onlineUsersMap: {},
            }

            addOnlineUser(state, key, onlineUserData)

            expect(state.onlineUsersMap).toHaveProperty(key, {
                username,
                roomId,
                color: userColorsList[4],
            })

            // currentIndex at the end of userColorsList.length increment
            state = {
                currentIndex: userColorsList.length - 1,
                onlineUsersMap: {},
            }

            addOnlineUser(state, key, onlineUserData)

            expect(state.onlineUsersMap).toHaveProperty(key, {
                username,
                roomId,
                color: userColorsList[0],
            })

            // add user when there is already user in map
            const firstKey = "first-key"
            const firstUsername = "first@site.com"
            const firstRoomId = "first-room"
            const firstColor = userColorsList[0]
            state = {
                currentIndex: -1,
                onlineUsersMap: {
                    [firstKey]: {
                        username: firstUsername,
                        roomId: firstRoomId,
                        color: firstColor,
                    },
                },
            }

            addOnlineUser(state, key, onlineUserData)

            expect(state.onlineUsersMap).toHaveProperty(firstKey, {
                username: firstUsername,
                roomId: firstRoomId,
                color: firstColor,
            })
            expect(state.onlineUsersMap).toHaveProperty(key, {
                username,
                roomId,
                color: userColorsList[0],
            })
        })
    })

    describe("getDataForUser()", () => {
        it("should return online users map from state", () => {
            const key = "some-key"
            const onlineUsersMap = {
                [key]: {
                    username: "user@site.com",
                    roomId: "some-room",
                    color: userColorsList[0],
                },
            }
            const state: State = {
                currentIndex: 3,
                onlineUsersMap,
            }
            const data = getDataForUser(state, key)

            expect(data).toEqual(onlineUsersMap[key])
        })
    })

    describe("updateUserRoom()", () => {
        it("should update user room in state", () => {
            const key = "some-key"
            const onlineUsersMap = {
                [key]: {
                    username: "user@site.com",
                    roomId: "some-room",
                    color: userColorsList[0],
                },
                "another-key": {
                    username: "second-user@site.com",
                    roomId: "some-room",
                    color: userColorsList[1],
                },
            }
            const state: State = {
                currentIndex: 2,
                onlineUsersMap,
            }
            const roomId = "new-room"

            updateUserRoom(state, key, roomId)

            expect(state.onlineUsersMap[key].roomId).toBe(roomId)
            expect(state.onlineUsersMap["another-key"].roomId).toBe("some-room")
        })
    })

    describe("removeOnlineUser()", () => {
        it("should remove user from state", () => {
            const onlineUsersMap = {
                "first-key": {
                    username: "user@site.com",
                    roomId: "some-room",
                    color: userColorsList[0],
                },
                "another-key": {
                    username: "second-user@site.com",
                    roomId: "some-room",
                    color: userColorsList[1],
                },
            }
            const state: State = {
                currentIndex: 2,
                onlineUsersMap,
            }

            removeOnlineUser(state, "another-key")

            expect(state.onlineUsersMap).not.toHaveProperty("another-key")
            expect(state.onlineUsersMap).toHaveProperty("first-key")
        })
    })

    describe("getOnlineUsers()", () => {
        it("should return online users map", () => {
            const onlineUsersMap = {
                "first-key": {
                    username: "user@site.com",
                    roomId: "some-room",
                    color: userColorsList[0],
                },
                "another-key": {
                    username: "second-user@site.com",
                    roomId: "some-room",
                    color: userColorsList[1],
                },
            }
            const state: State = {
                currentIndex: 2,
                onlineUsersMap,
            }

            const onlineUsers = getOnlineUsers(state)

            expect(onlineUsers).toEqual(onlineUsersMap)
        })
    })

    describe("constructClientData()", () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        it("should return a promise which rejects with an error if room data is not found", (done) => {
            const userId = "first-key"

            const onlineUsersMap = {
                [userId]: {
                    username: "user@site.com",
                    roomId: "some-room",
                    color: userColorsList[0],
                },
                "another-key": {
                    username: "second-user@site.com",
                    roomId: "some-room",
                    color: userColorsList[1],
                },
            }

            const state: State = {
                currentIndex: 2,
                onlineUsersMap,
            }

            const getDataForUser = jest.fn<OnlineUser, []>().mockReturnValue({
                username: "user@site.com",
                roomId: "some-room",
                color: userColorsList[0],
            })

            const error = new Error("Error finding rooms")
            RoomModel.find = jest.fn().mockRejectedValue(error)

            const promise = constructClientData(
                state,
                getDataForUser,
                RoomModel,
                userId
            )
            promise.catch((err) => {
                expect(err).toEqual(error)
                done()
            })
        })

        it("should return a promise which resolves with client data when rooms are found", (done) => {
            const userId = "first-key"
            const firstUser = {
                username: "user@site.com",
                roomId: "room1",
                color: userColorsList[0],
            }
            const secondUser = {
                username: "second-user@site.com",
                roomId: "room2",
                color: userColorsList[1],
            }
            const thirdUser = {
                username: "third-user@site.com",
                roomId: "room1",
                color: userColorsList[2],
            }

            const onlineUsersMap = {
                [userId]: firstUser,
                "another-key": secondUser,
                "yet-another-key": thirdUser,
            }

            const state: State = {
                currentIndex: 2,
                onlineUsersMap,
            }

            const getDataForUser = jest.fn<OnlineUser, []>().mockReturnValue({
                username: "user@site.com",
                roomId: "room1",
                color: userColorsList[0],
            })

            RoomModel.find = jest.fn().mockResolvedValue([
                {
                    id: "room1",
                    name: "Room 1",
                    gridColStart: 0,
                    gridColEnd: 2,
                    gridRowStart: 0,
                    gridRowEnd: 2,
                    doors: [],
                    titlePosition: RoomTitlePosition.Top,
                    roomType: RoomType.MeetingRoom,
                },
                {
                    id: "room2",
                    name: "Room 2",
                    gridColStart: 0,
                    gridColEnd: 2,
                    gridRowStart: 0,
                    gridRowEnd: 2,
                    doors: [],
                    titlePosition: RoomTitlePosition.Top,
                    roomType: RoomType.MeetingRoom,
                },
                {
                    id: "room4",
                    name: "Room 4",
                    gridColStart: 0,
                    gridColEnd: 2,
                    gridRowStart: 0,
                    gridRowEnd: 2,
                    doors: [],
                    titlePosition: RoomTitlePosition.Top,
                    roomType: RoomType.MeetingRoom,
                },
            ])
            const expectedData: ClientData = {
                currentUser: firstUser,
                onlineUsers: [firstUser, secondUser, thirdUser],
                rooms: [
                    {
                        id: "room1",
                        name: "Room 1",
                        gridColStart: 0,
                        gridColEnd: 2,
                        gridRowStart: 0,
                        gridRowEnd: 2,
                        doors: [],
                        titlePosition: RoomTitlePosition.Top,
                        roomType: RoomType.MeetingRoom,
                        users: [
                            {
                                username: firstUser.username,
                                color: firstUser.color,
                            },
                            {
                                username: thirdUser.username,
                                color: thirdUser.color,
                            },
                        ],
                    },
                    {
                        id: "room2",
                        name: "Room 2",
                        gridColStart: 0,
                        gridColEnd: 2,
                        gridRowStart: 0,
                        gridRowEnd: 2,
                        doors: [],
                        titlePosition: RoomTitlePosition.Top,
                        roomType: RoomType.MeetingRoom,
                        users: [
                            {
                                username: secondUser.username,
                                color: secondUser.color,
                            },
                        ],
                    },
                    {
                        id: "room4",
                        name: "Room 4",
                        gridColStart: 0,
                        gridColEnd: 2,
                        gridRowStart: 0,
                        gridRowEnd: 2,
                        doors: [],
                        titlePosition: RoomTitlePosition.Top,
                        roomType: RoomType.MeetingRoom,
                        users: [],
                    },
                ],
            }

            const promise = constructClientData(
                state,
                getDataForUser,
                RoomModel,
                userId
            )
            promise.then((data) => {
                expect(data).toEqual(expectedData)
                done()
            })
        })
    })

    describe("deserializeUser()", () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        it("should return a promise which rejects with error if user cannot be found by id", (done) => {
            UserModel.findById = jest.fn().mockRejectedValue({})
            const id = "12345"

            const promise = deserializeUser(UserModel, id)
            promise.catch((err) => {
                expect(UserModel.findById).toBeCalledWith(id)
                expect(err).toEqual(new Error("Deserialization failed"))
                done()
            })
        })

        it("should return a promise which resolves with the user if user is found by id", (done) => {
            const user = {
                username: "user@site.com",
            }
            UserModel.findById = jest.fn().mockResolvedValue(user)
            const id = "12345"

            const promise = deserializeUser(UserModel, id)
            promise.then((userData) => {
                expect(UserModel.findById).toBeCalledWith(id)
                expect(userData).toEqual(user)
                done()
            })
        })
    })
})
