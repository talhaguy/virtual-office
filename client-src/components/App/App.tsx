import React, { useContext, useState } from "react"
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom"

import { LoginPage } from "../LoginPage"
import { RegisterPage } from "../RegisterPage"
import { DependenciesContext } from "../../DependenciesContext"
import { MainPage } from "../MainPage"
import { NotFoundPage } from "../NotFoundPage"

export function App() {
    const { username } = useContext(DependenciesContext)
    const [isLoggedIn, setIsLoggedIn] = useState(username ? true : false)

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
                        <MainPage username={username} isLoggedIn={isLoggedIn} />
                    )}
                </Route>
                <Route path="*">
                    <NotFoundPage />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}
