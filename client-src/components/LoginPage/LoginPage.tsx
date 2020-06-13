import React from "react"
import { Link } from "react-router-dom"

export const LoginPage = () => (
    <div>
        <h1>Log in</h1>
        <form action="/login" method="POST">
            <div>
                username: <input type="text" name="username" />
            </div>
            <div>
                password: <input type="password" name="password" />
            </div>
            <button type="submit">Submit</button>
        </form>
        <Link to="/register">Register</Link>
    </div>
)
