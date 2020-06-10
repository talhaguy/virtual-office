import React from "react"
import { TextInput } from "./TextInput"
import styles from "./Chat.module.css"
import { Button, ButtonType, ButtonSize } from "./Button"

interface ChatProps {
    messages: string[]
    onSubmitHandler: (event: React.FormEvent<HTMLFormElement>) => void
}

export function Chat({ messages, onSubmitHandler }: ChatProps) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>Chat</div>
            <div className={styles.body}>
                <ul>
                    {messages.map((message, i) => {
                        return <li key={i}>{message}</li>
                    })}
                </ul>
                <hr className={styles.divider} />
                <form onSubmit={onSubmitHandler}>
                    <div className={styles.chatInput}>
                        <TextInput name="message" />
                    </div>
                    <Button
                        type={ButtonType.Submit}
                        size={ButtonSize.Full}
                        label="Send"
                    />
                </form>
            </div>
        </div>
    )
}
