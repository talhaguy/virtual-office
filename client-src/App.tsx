import React, { useContext, useState, useEffect } from "react"
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom"
import io from "socket.io-client"

import { LoginPage } from "./LoginPage"
import { RegisterPage } from "./RegisterPage"
import { DependenciesContext } from "./DependenciesContext"
import { MainPage } from "./MainPage"
import { NotFoundPage } from "./NotFoundPage"
import {
    OnlineUser,
    ServerResponse,
    IOEventResponseData,
    ClientData,
    RoomClientData,
} from "../shared-src/models"
import { IOEvents } from "../shared-src/constants"

export function App() {
    const { username } = useContext(DependenciesContext)
    const [isLoggedIn, setIsLoggedIn] = useState(username ? true : false)
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
    const [rooms, setRooms] = useState<RoomClientData[]>([])

    useEffect(() => {
        if (isLoggedIn) {
            const socket = io()

            fetch("/data/getClientData", {
                method: "post",
            })
                .then<ServerResponse<ClientData>>((response) => response.json())
                .then((response) => {
                    setOnlineUsers(response.data.onlineUsers)
                    setRooms(response.data.rooms)
                })
                .catch((err) => {})

            socket.on(
                IOEvents.OnlineUsersChange,
                (ioEventResponseData: IOEventResponseData<OnlineUser[]>) => {
                    setOnlineUsers(ioEventResponseData.data)
                }
            )
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
                        <MainPage onlineUsers={onlineUsers} rooms={rooms} />
                    )}
                </Route>
                <Route path="*">
                    <NotFoundPage />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}
