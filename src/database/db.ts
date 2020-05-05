import mongoose, { Mongoose } from "mongoose"

export function connect(mongoose: Mongoose) {
    mongoose.connect(process.env.DB_PATH, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    const db = mongoose.connection

    db.on("error", console.error.bind(console, "connection error:"))

    db.once("open", function () {
        console.log("connected to DB", db.collections.length)
    })
}

export const database = mongoose
