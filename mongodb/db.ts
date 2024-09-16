import mongoose from 'mongoose';

const connectionString = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.twj7n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Ensure the connection string is provided
if (!connectionString) {
    throw new Error('Provide a valid connection string');
}

const connectDb = async () => {
    if(mongoose.connection?.readyState >= 1){
          return;  
    }

    try {
        // Connect to MongoDB using the connection string
        console.log("connecting")
        await mongoose.connect(connectionString);
        // console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);  // Exit the process with failure if connection fails
    }
};

export default connectDb;
