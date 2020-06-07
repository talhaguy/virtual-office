import React from "react"
import styles from "./Panel.module.css"

export enum PanelType {
    Normal,
    NoShadowNoBorderRadius,
}

export enum PanelTitlePosition {
    Top,
    Bottom,
}

interface PanelProps {
    title: string
    titlePosition?: PanelTitlePosition
    titleButton: React.ReactNode
    type?: PanelType
}

export const Panel: React.FC<PanelProps> = ({
    title,
    titlePosition,
    titleButton,
    type,
    children,
}) => {
    let panelTypeClassName: string
    switch (type) {
        case PanelType.Normal:
            panelTypeClassName = styles.typeNormal
            break
        case PanelType.NoShadowNoBorderRadius:
        default:
            panelTypeClassName = styles.typeNoShadowNoBorderRadius
            break
    }

    let panelTitleClassName: string
    switch (titlePosition) {
        case PanelTitlePosition.Bottom:
            panelTitleClassName = styles.titleBottom
            break
        case PanelTitlePosition.Top:
        default:
            panelTitleClassName = styles.titleTop
            break
    }

    return (
        <div
            className={`${styles.container} ${panelTypeClassName} ${panelTitleClassName}`}
        >
            <div className={styles.title}>
                <div>{title}</div>
                <div>{titleButton}</div>
            </div>
            <div className={styles.contents}>{children}</div>
        </div>
    )
}
