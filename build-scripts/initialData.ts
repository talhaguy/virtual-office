import { database } from "../src/database"
import { RoomModel, UserModel } from "../src/databaseModels"
import mongoose from "mongoose"

export async function initialData() {
    try {
        await mongoose.connect(process.env["DB_PATH"], {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("db connected to")
    } catch (err) {
        console.error("there was an error connecting to db")
    }

    try {
        await database.connection.db.dropDatabase()
        console.log("dropped database")
    } catch (err) {
        console.error("there was an error dropping the database")
    }

    const userOne = new UserModel({
        username: "a@a.com",
        password: "asdfasdf",
    })

    try {
        await userOne.save()
        console.log("done saving userOne")
    } catch (err) {
        console.error("There was an error saving userOne")
    }

    const userTwo = new UserModel({
        username: "b@b.com",
        password: "asdfasdf",
    })

    try {
        await userTwo.save()
        console.log("done saving userTwo")
    } catch (err) {
        console.error("There was an error saving userTwo")
    }

    const lobby = new RoomModel({
        id: "lobby",
        name: "Lobby",
    })

    const meetingRoom = new RoomModel({
        id: "meetingRoom",
        name: "Meeting Room",
    })

    try {
        await RoomModel.create(lobby, meetingRoom)
        console.log("done saving rooms")
    } catch (err) {
        console.error("There was an error saving rooms")
    }

    mongoose.disconnect()
}
