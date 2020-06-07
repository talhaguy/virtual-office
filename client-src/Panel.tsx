import React from "react"
import styles from "./Panel.module.css"

export enum PanelType {
    Normal,
    DropShadowAsBorder,
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
    extraClassNames: string
}

export const Panel: React.FC<PanelProps> = ({
    title,
    titlePosition,
    titleButton,
    type,
    extraClassNames,
    children,
}) => {
    let panelTypeClassName: string
    switch (type) {
        case PanelType.Normal:
            panelTypeClassName = styles.typeNormal
            break
        case PanelType.DropShadowAsBorder:
        default:
            panelTypeClassName = styles.typeDropShadowAsBorder
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
            className={`${styles.container} ${panelTypeClassName} ${panelTitleClassName} ${extraClassNames}`}
        >
            <div className={styles.title}>
                <div>{title}</div>
                <div>{titleButton}</div>
            </div>
            <div className={styles.contents}>{children}</div>
        </div>
    )
}
