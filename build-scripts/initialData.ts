import { database } from "../src/database"
import { RoomModel, UserModel } from "../src/databaseModels"
import mongoose from "mongoose"
import { RoomType } from "../shared-src/constants"
import { DoorSide, RoomTitlePosition } from "../shared-src/models"

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
        gridColStart: 1,
        gridColEnd: 3,
        gridRowStart: 1,
        gridRowEnd: 3,
        roomType: RoomType.Desks,
        titlePosition: RoomTitlePosition.Top,
        doors: [
            {
                side: DoorSide.Bottom,
                position: 75,
            },
        ],
    })

    const quietRoom = new RoomModel({
        id: "quietRoom",
        name: "Quiet Room",
        gridColStart: 3,
        gridColEnd: 5,
        gridRowStart: 2,
        gridRowEnd: 3,
        roomType: RoomType.QuietRoom,
        titlePosition: RoomTitlePosition.Top,
        doors: [
            {
                side: DoorSide.Left,
                position: 50,
            },
            {
                side: DoorSide.Bottom,
                position: 25,
            },
        ],
    })

    const meetingRoom = new RoomModel({
        id: "meetingRoom",
        name: "Meeting Room",
        gridColStart: 2,
        gridColEnd: 3,
        gridRowStart: 3,
        gridRowEnd: 5,
        roomType: RoomType.MeetingRoom,
        titlePosition: RoomTitlePosition.Bottom,
        doors: [],
    })

    const breakRoom = new RoomModel({
        id: "breakRoom",
        name: "Break Room",
        gridColStart: 3,
        gridColEnd: 4,
        gridRowStart: 3,
        gridRowEnd: 4,
        roomType: RoomType.Break,
        titlePosition: RoomTitlePosition.Bottom,
        doors: [
            {
                side: DoorSide.Left,
                position: 50,
            },
        ],
    })

    try {
        await RoomModel.create(desksRoom, quietRoom, meetingRoom, breakRoom)
        console.log("done saving rooms")
    } catch (err) {
        console.log("There was an error saving rooms:")
        console.error(err)
    }

    mongoose.disconnect()
}
