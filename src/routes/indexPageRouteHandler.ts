import { Response, Request } from "express"
import ejs from "ejs"
import { PROJECT_ROOT_PATH } from "../constants"

export function indexPageHandler(
    pathToIndex: string,
    req: Request,
    res: Response
) {
    ejs.renderFile(`${PROJECT_ROOT_PATH}/src/templates/index.ejs`, {
        test: "TEST STRING",
    }).then((html) => {
        res.send(html)
    })
}
