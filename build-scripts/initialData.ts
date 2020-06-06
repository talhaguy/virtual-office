import { database } from "../src/database"
import { RoomModel, UserModel } from "../src/databaseModels"
import mongoose from "mongoose"
import { RoomType } from "../shared-src/constants"

export async function initialData() {
    try {
        await mongoose.connect(process.env["DB_PATH"], {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("db connected to")
    } catch (err) {
        console.log("there was an error connecting to db")
        console.error(err)
    }

    try {
        await database.connection.db.dropDatabase()
        console.log("dropped database")
    } catch (err) {
        console.log("there was an error dropping the database")
        console.error(err)
    }

    const userOne = new UserModel({
        username: "a@a.com",
        password: "asdfasdf",
    })

    try {
        await userOne.save()
        console.log("done saving userOne")
    } catch (err) {
        console.log("There was an error saving userOne")
        console.error(err)
    }

    const userTwo = new UserModel({
        username: "b@b.com",
        password: "asdfasdf",
    })

    try {
        await userTwo.save()
        console.log("done saving userTwo")
    } catch (err) {
        console.log("There was an error saving userTwo")
        console.error(err)
    }

    const desksRoom = new RoomModel({
        id: "desksRoom",
        name: "Desks Room",
        width: 3,
        roomType: RoomType.Desks,
    })

    const meetingRoom = new RoomModel({
        id: "meetingRoom",
        name: "Meeting Room",
        width: 2,
        roomType: RoomType.MeetingRoom,
    })

    const breakRoom = new RoomModel({
        id: "breakRoom",
        name: "Break Room",
        width: 1,
        roomType: RoomType.Break,
    })

    try {
        await RoomModel.create(desksRoom, meetingRoom, breakRoom)
        console.log("done saving rooms")
    } catch (err) {
        console.log("There was an error saving rooms:")
        console.error(err)
    }

    mongoose.disconnect()
}
