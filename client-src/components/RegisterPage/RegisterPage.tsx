import React from "react"
import { Link } from "react-router-dom"

export const RegisterPage = () => (
    <div>
        <div>
            <h1>Register</h1>
            <form action="/register" method="POST">
                <div>
                    username: <input type="text" name="username" />
                </div>
                <div>
                    password: <input type="password" name="password" />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
        <Link to="/login">Already Have an Account?</Link>
    </div>
)
