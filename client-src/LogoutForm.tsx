import React from "react"

export const LogoutForm = () => (
    <form action="/logout" method="POST">
        Log out:
        <br />
        <button type="submit">Log out</button>
    </form>
)
