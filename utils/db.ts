import mongoose from "mongoose";

type Connection = {
    isConnected?: number;
}

const connection: Connection = {}

export const connecToDb = async(): Promise<void> => {
    if(connection.isConnected) {
        console.log("Connection is already made to the database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.DB_CONN_STRING || "");
        connection.isConnected = db.connections[0].readyState;

        console.log("Database connected successfully");
    } catch (error) {
        console.log("Error connecting to database: ", error);
        process.exit(1);
    }
}

export default connecToDb