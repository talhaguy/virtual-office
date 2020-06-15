import React, { useContext } from "react"
import styles from "./SinglePageFormContainer.module.css"
import { Panel } from "../Panel"
import { DependenciesContext } from "../../DependenciesContext"
import { Message, MessageType } from "../Message"

interface SinglePageFormContainerProps {
    title: string
}

export const SinglePageFormContainer: React.FC<SinglePageFormContainerProps> = ({
    title,
    children,
}) => {
    const {
        initialClientData: { flashMessages },
    } = useContext(DependenciesContext)

    return (
        <div className={styles.container}>
            <div className={styles.innerContainer}>
                <h1>Virtual Office</h1>
                <Panel title={title}>{children}</Panel>
                {flashMessages.error && flashMessages.error.length > 0
                    ? flashMessages.error.map((message, i) => (
                          <div key={i} className={styles.messageContainer}>
                              <Message type={MessageType.Error}>
                                  {message}
                              </Message>
                          </div>
                      ))
                    : ""}
                {flashMessages.info && flashMessages.info.length > 0
                    ? flashMessages.info.map((message, i) => (
                          <div key={i} className={styles.messageContainer}>
                              <Message>{message}</Message>
                          </div>
                      ))
                    : ""}
            </div>
        </div>
    )
}
