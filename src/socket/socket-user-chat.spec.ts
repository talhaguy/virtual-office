import { onUserChatFactory } from "./socket-user-chat"
import { Server } from "socket.io"
import {
    IOEventResponseData,
    IOEventChatMessageData,
    UserColor,
    ChatMessageType,
} from "../../shared-src/models"
import { IOEvents } from "../../shared-src/constants"
import { OnlineUser } from "../../shared-src/models"

describe("socket-user-chat", () => {
    describe("onUserChatFactory()", () => {
        it("should create chat event data to emit to a room", () => {
            const emit = jest.fn()
            const io = ({
                to: jest.fn().mockReturnValue({
                    emit,
                }),
            } as unknown) as Server
            const user: OnlineUser = {
                username: "user@site.com",
                roomId: "room-one",
                color: UserColor.Blue,
            }
            const getDataForUser = jest.fn().mockReturnValue(user)
            const onUserChat = onUserChatFactory(io, getDataForUser)

            const ioEventResponseData: IOEventResponseData<Omit<
                IOEventChatMessageData,
                "username" | "userColor" | "time" | "type"
            >> = {
                data: {
                    roomId: "room-one",
                    message: "this is a message",
                },
            }
            const userId = "12345"
            onUserChat(ioEventResponseData, userId)

            expect(getDataForUser).toBeCalledWith(userId)
            expect(io.to).toBeCalledWith("room-one")
            expect(emit.mock.calls[0][0]).toBe(IOEvents.UserChat)
            expect(emit.mock.calls[0][1].data.type).toBe(
                ChatMessageType.UserMessage
            )
            expect(emit.mock.calls[0][1].data.roomId).toBe("room-one")
            expect(emit.mock.calls[0][1].data.message).toBe("this is a message")
            expect(emit.mock.calls[0][1].data.username).toBe("user@site.com")
            expect(emit.mock.calls[0][1].data.userColor).toBe(UserColor.Blue)
        })
    })
})
