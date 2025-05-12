import mongoose from "mongoose";

export const conncetDB = async ()=>{
try {
    mongoose.connection.on('connected', ()=>{
        console.log("Connected to MongoDB");
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/wegegna`)
} catch (error) {
    console.log(error);
}
}