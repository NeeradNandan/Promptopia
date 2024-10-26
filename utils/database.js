import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if(isConnected){
        console.log('MongoDB is already connected');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName : "share_prompt",
            maxPoolSize: 10, // Optional: limit the number of connections in the pool
            serverSelectionTimeoutMS: 5000, // Optional: prevent long waits during server selection
            socketTimeoutMS: 45000, // Optional: specify a maximum time for inactivity
            //useNewUrlParser: true, //Deprecated
            //useUnifiedTopology: true, //Deprecated
        })

        isConnected = true;

        console.log('MongoDB is connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw new Error('Database connection failed'); // Re-throw to catch in the API route
    }

}