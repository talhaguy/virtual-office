import { UserColor } from "./UserColor"

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IOEventResponseData<T> {
    data: T
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IOEventRoomChangeData {
    previousRoomId: string
    newRoomId: string
}

export enum ChatMessageType {
    Status,
    UserMessage,
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IOEventChatMessageData {
    type: ChatMessageType
    roomId: string
    username?: string
    userColor?: UserColor
    message: string
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IOEventStatusUpdate {
    username: string
    message: string
    userColor: UserColor
}
