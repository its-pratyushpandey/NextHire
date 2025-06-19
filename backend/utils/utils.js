import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const checkDBConnection = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB connection test successful');
        process.exit(0);
    } catch (error) {
        console.error('MongoDB connection test failed:', error.message);
        process.exit(1);
    }
};

checkDBConnection();