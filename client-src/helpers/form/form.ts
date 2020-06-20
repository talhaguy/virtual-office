export interface SubmitHtmlFormFunction {
    (form: HTMLFormElement): void
}

export const submitHtmlForm: SubmitHtmlFormFunction = (
    form: HTMLFormElement
) => {
    form.submit()
}
