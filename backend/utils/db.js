import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MongoDB connection string is missing');
        }

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            family: 4,
            maxPoolSize: 10,
            minPoolSize: 5,
            retryWrites: true,
            w: 'majority'
        };

        const conn = await mongoose.connect(process.env.MONGO_URI, options);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('connected', () => {
            console.log('MongoDB reconnected successfully');
        });

        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                console.log('MongoDB connection closed through app termination');
                process.exit(0);
            } catch (err) {
                console.error('Error during MongoDB connection closure:', err);
                process.exit(1);
            }
        });

        return true;
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        if (error.name === 'MongoServerSelectionError') {
            console.error('Could not connect to any MongoDB server. Please check:');
            console.error('1. Your IP address is whitelisted in MongoDB Atlas');
            console.error('2. Your connection string is correct');
            console.error('3. Your network connection is stable');
        }
        return false;
    }
};

export default connectDB;