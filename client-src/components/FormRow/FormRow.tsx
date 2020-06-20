import React from "react"
import * as styles "./FormRow.module.css"

export enum FormRowVerticalSpacing {
    Medium,
    Large,
}

interface FormRowProps {
    verticalSpacing?: FormRowVerticalSpacing
}

export const FormRow: React.FC<FormRowProps> = ({
    verticalSpacing = FormRowVerticalSpacing.Medium,
    children,
}) => {
    return (
        <div
            className={`${styles.row} ${
                verticalSpacing === FormRowVerticalSpacing.Large
                    ? styles.verticalSpacingLarge
                    : styles.verticalSpacingMedium
            }`}
        >
            {children}
        </div>
    )
}
