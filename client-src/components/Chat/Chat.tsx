import React, { useRef, useEffect } from "react"
import { TextInput } from "../TextInput"
import * as styles from "./Chat.module.css"
import { Button, ButtonType, ButtonSize } from "../Button"
import {
    IOEventChatMessageData,
    ChatMessageType,
} from "../../../shared-src/models"

interface ChatProps {
    messages: IOEventChatMessageData[]
    onChatMessageSubmitHandler: (
        event: React.FormEvent<HTMLFormElement>
    ) => void
}

export function Chat({ messages, onChatMessageSubmitHandler }: ChatProps) {
    const messageListRef = useRef<HTMLUListElement>(null)

    useEffect(() => {
        // scroll message list to the bottom to see latest message
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    })

    const getFormattedMessageDate = (time: number) => {
        const date = new Date(time)
        const hours = date.getHours()
        const minutes = date.getMinutes()
        return `${hours === 0 ? "12" : hours > 12 ? hours - 12 : hours}:${
            minutes < 10 ? `0${minutes}` : minutes
        } ${hours >= 12 ? "pm" : "am"}`
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>Chat</div>
            <ul className={styles.messageList} ref={messageListRef}>
                {messages.map((message, i) => {
                    return (
                        <li key={i} className={styles.messageContainer}>
                            {message.type == ChatMessageType.UserMessage ? (
                                <>
                                    <div
                                        style={{
                                            color: message.userColor,
                                        }}
                                        className={styles.userNameContainer}
                                    >
                                        <span className={styles.userName}>
                                            {message.username}
                                        </span>
                                        ,{" "}
                                        {getFormattedMessageDate(message.time)}
                                    </div>
                                    <div className={styles.message}>
                                        {message.message}
                                    </div>
                                </>
                            ) : (
                                <div className={styles.statusMessage}>
                                    {message.message}
                                </div>
                            )}
                        </li>
                    )
                })}
            </ul>
            <form className={styles.form} onSubmit={onChatMessageSubmitHandler}>
                <hr className={styles.divider} />

                <div className={styles.chatInput}>
                    <TextInput name="message" autocomplete={"off"} />
                </div>
                <Button
                    type={ButtonType.Submit}
                    size={ButtonSize.Full}
                    label="Send"
                />
            </form>
        </div>
    )
}
