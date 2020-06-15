import React, { useContext } from "react"
import styles from "./SinglePageFormContainer.module.css"
import { Panel } from "../Panel"
import { DependenciesContext } from "../../DependenciesContext"
import { WarningMessage } from "../WarningMessage"
import { WarningMessageType } from "../WarningMessage/WarningMessage"

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
                          <div
                              key={i}
                              className={styles.warningMessageContainer}
                          >
                              <WarningMessage type={WarningMessageType.Error}>
                                  {message}
                              </WarningMessage>
                          </div>
                      ))
                    : ""}
                {flashMessages.info && flashMessages.info.length > 0
                    ? flashMessages.info.map((message, i) => (
                          <div
                              key={i}
                              className={styles.warningMessageContainer}
                          >
                              <WarningMessage>{message}</WarningMessage>
                          </div>
                      ))
                    : ""}
            </div>
        </div>
    )
}
