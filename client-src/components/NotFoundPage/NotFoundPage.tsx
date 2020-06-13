import React from "react"
import { Link } from "react-router-dom"

export const NotFoundPage = () => {
    return (
        <div>
            Page Not Found
            <br />
            <Link to="/">Return home</Link>
        </div>
    )
}
