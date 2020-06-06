// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IOEventResponseData<T> {
    data: T
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IOEventChatMessageData {
    roomId: string
    message: string
}
