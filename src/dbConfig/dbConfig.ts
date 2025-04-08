import mongoose from "mongoose";


export async function connect() {
    try {

        if (mongoose.connections[0].readyState) {
            // Use current db connection
            return;
        }
        
        mongoose.connect(process.env.MONGODB_URI!)
        const connection = mongoose.connection

        connection.on("connected", () => {
            console.log("MongoDb Connected");
        })

        connection.on("error", (err) => {
            console.log("MongoDB connection error:", err);
            process.exit()
        })

    } catch (error) {
        console.log("Something went wrong in db", error);

    }
}
