import { Document } from "mongoose"
import { UserModel as _UserModel } from "./UserModel"
import { User } from "../models"

export interface CreateUser {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc: any): User & Document
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createUser: CreateUser = (doc: any) => new _UserModel(doc)

export const UserModel = _UserModel
