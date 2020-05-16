import React, { useContext, useState, useEffect } from "react"
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom"
import io from "socket.io-client"

import { LoginPage } from "./LoginPage"
import { RegisterPage } from "./RegisterPage"
import { DependenciesContext } from "./DependenciesContext"
import { MainPage } from "./MainPage"
import { NotFoundPage } from "./NotFoundPage"

export function App() {
    const { username } = useContext(DependenciesContext)
    const [isLoggedIn, setIsLoggedIn] = useState(username ? true : false)

    useEffect(() => {
        if (isLoggedIn) {
            const socket = io()
        }
    }, [isLoggedIn])

    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    {!isLoggedIn ? (
                        <Redirect
                            to={{
                                pathname: "/login",
                            }}
                        />
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/main",
                            }}
                        />
                    )}
                </Route>
                <Route exact path="/login">
                    {!isLoggedIn ? (
                        <LoginPage />
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/main",
                            }}
                        />
                    )}
                </Route>
                <Route exact path="/register">
                    {!isLoggedIn ? (
                        <RegisterPage />
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/main",
                            }}
                        />
                    )}
                </Route>
                <Route exact path="/main">
                    {!isLoggedIn ? (
                        <Redirect
                            to={{
                                pathname: "/login",
                            }}
                        />
                    ) : (
                        <MainPage />
                    )}
                </Route>
                <Route path="*">
                    <NotFoundPage />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}
