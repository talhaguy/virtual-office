import React from "react"

interface ChatProps {
    messages: string[]
    onSubmitHandler: (event: React.FormEvent<HTMLFormElement>) => void
}

export function Chat({ messages, onSubmitHandler }: ChatProps) {
    return (
        <div>
            <ul>
                {messages.map((message, i) => {
                    return <li key={i}>{message}</li>
                })}
            </ul>
            <form onSubmit={onSubmitHandler}>
                <textarea name="message"></textarea>
                <button type="submit">Send</button>
            </form>
        </div>
    )
}
