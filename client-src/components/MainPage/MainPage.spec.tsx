import React from "react"
import io from "socket.io-client"
import { Dependencies, DependenciesContext } from "../../DependenciesContext"
import { render, fireEvent } from "@testing-library/react"
import { MainPage } from "./MainPage"
import {
    InitialClientData,
    IOEventResponseData,
    ClientData,
    UserColor,
    RoomTitlePosition,
    DoorSide,
} from "../../../shared-src/models"
import { validatePassword, validateEmail } from "../../../shared-src/validation"
import { RoomType, IOEvents } from "../../../shared-src/constants"
import { act } from "react-dom/test-utils"

const socket = {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
}

jest.mock("socket.io-client", () => {
    return () => socket
})

const createClientDataIoEventResponseData = (
    roomIdToBeIn: "meetingRoom" | "desksRoom" | "quietRoom" | "breakRoom"
) => {
    const clientDataIoEventResponseData: IOEventResponseData<ClientData> = {
        data: {
            currentUser: {
                username: "user@site.com",
                roomId: roomIdToBeIn,
                color: UserColor.Blue,
            },
            onlineUsers: [
                {
                    username: "user@site.com",
                    roomId: roomIdToBeIn,
                    color: UserColor.Blue,
                },
            ],
            rooms: [
                {
                    id: "meetingRoom",
                    name: "Meeting Room",
                    users: [],
                    gridColStart: 2,
                    gridColEnd: 3,
                    gridRowStart: 3,
                    gridRowEnd: 5,
                    doors: [],
                    titlePosition: RoomTitlePosition.Bottom,
                    roomType: RoomType.MeetingRoom,
                },
                {
                    id: "desksRoom",
                    name: "Desks Room",
                    users: [],
                    gridColStart: 1,
                    gridColEnd: 3,
                    gridRowStart: 1,
                    gridRowEnd: 3,
                    doors: [
                        {
                            side: DoorSide.Bottom,
                            position: 75,
                        },
                    ],
                    titlePosition: RoomTitlePosition.Top,
                    roomType: RoomType.Desks,
                },
                {
                    id: "quietRoom",
                    name: "Quiet Room",
                    users: [],
                    gridColStart: 3,
                    gridColEnd: 5,
                    gridRowStart: 2,
                    gridRowEnd: 3,
                    doors: [
                        {
                            side: DoorSide.Left,
                            position: 50,
                        },
                        {
                            side: DoorSide.Bottom,
                            position: 25,
                        },
                    ],
                    titlePosition: RoomTitlePosition.Top,
                    roomType: RoomType.QuietRoom,
                },
                {
                    id: "breakRoom",
                    name: "Break Room",
                    users: [],
                    gridColStart: 3,
                    gridColEnd: 4,
                    gridRowStart: 3,
                    gridRowEnd: 4,
                    doors: [
                        {
                            side: DoorSide.Left,
                            position: 50,
                        },
                    ],
                    titlePosition: RoomTitlePosition.Bottom,
                    roomType: RoomType.Break,
                },
            ],
        },
    }

    const roomIndex = clientDataIoEventResponseData.data.rooms.findIndex(
        (room) => {
            return room.id === roomIdToBeIn
        }
    )
    clientDataIoEventResponseData.data.rooms[roomIndex].users = [
        {
            username: "user@site.com",
            color: UserColor.Blue,
        },
    ]

    return clientDataIoEventResponseData
}

describe("MainPage", () => {
    const setupComponent = (dependencies: Dependencies) => {
        return render(
            <DependenciesContext.Provider value={dependencies}>
                <MainPage username={"user@site.com"} isLoggedIn={true} />
            </DependenciesContext.Provider>
        )
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should be able to join different rooms", () => {
        const initialClientData: InitialClientData = {
            username: "user@site.com",
            flashMessages: {},
        }
        const dependencies: Dependencies = {
            initialClientData,
            validation: {
                validatePassword,
                validateEmail,
            },
            form: {
                submitHtmlForm: jest.fn(),
            },
            io,
        }
        const component = setupComponent(dependencies)

        // send data to client
        let clientDataIoEventResponseData = createClientDataIoEventResponseData(
            "desksRoom"
        )
        const onlineUsersChangeCall = socket.on.mock.calls.find((call) => {
            return call[0] === IOEvents.OnlineUsersChange
        })
        act(() => {
            onlineUsersChangeCall[1](clientDataIoEventResponseData)
        })

        // user should be in desksRoom
        const desksRoomContainer = component.getByTestId("room-desksRoom")
        expect(
            desksRoomContainer.querySelector('[aria-label="user@site.com"]')
        ).not.toBeNull()

        // move to breakRoom
        const breakRoomContainer = component.getByTestId("room-breakRoom")
        const breakRoomJoinButton = breakRoomContainer.querySelector("button")
        fireEvent.click(breakRoomJoinButton)
        expect(socket.emit).toBeCalledWith(IOEvents.UserJoinedRoom, {
            data: {
                previousRoomId: "desksRoom",
                newRoomId: "breakRoom",
            },
        })

        // server gives back data through online users change io event
        clientDataIoEventResponseData = createClientDataIoEventResponseData(
            "breakRoom"
        )
        act(() => {
            onlineUsersChangeCall[1](clientDataIoEventResponseData)
        })

        // user should be in breakRoom
        expect(
            desksRoomContainer.querySelector('[aria-label="user@site.com"]')
        ).toBeNull()
        expect(
            breakRoomContainer.querySelector('[aria-label="user@site.com"]')
        ).not.toBeNull()
    })

    it("should submit the logout form the log out button click", () => {
        const initialClientData: InitialClientData = {
            username: "user@site.com",
            flashMessages: {},
        }
        const dependencies: Dependencies = {
            initialClientData,
            validation: {
                validatePassword,
                validateEmail,
            },
            form: {
                submitHtmlForm: jest.fn(),
            },
            io,
        }
        const component = setupComponent(dependencies)

        const logoutButton = component.getByText(/log out/i)
        fireEvent.click(logoutButton)

        expect(dependencies.form.submitHtmlForm).toBeCalled()
    })

    it("should be able to send a chat message", () => {})
})
