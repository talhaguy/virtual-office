import { Logger } from "../models/Logger"

export const loggerMock: Logger = {
    log: jest.fn(),
    error: jest.fn(),
}

export function resetLoggerMock() {
    ;(loggerMock.log as jest.Mock).mockClear()
    ;(loggerMock.error as jest.Mock).mockClear()
}
