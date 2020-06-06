export enum RepsonseStatusText {
    Success = "SUCCESS",
    Error = "ERROR",
}

export interface ServerResponse<T> {
    status: RepsonseStatusText
    data: T
}
