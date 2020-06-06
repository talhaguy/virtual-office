import { Document } from "mongoose"
import { UserModel as _UserModel } from "./UserModel"
import { User } from "../models"

export interface CreateUser {
    (doc: any): User & Document
}

export const createUser: CreateUser = (doc: any) => new _UserModel(doc)

export const UserModel = _UserModel

export { RoomModel } from "./RoomModel"
