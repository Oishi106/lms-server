import mongoose from "mongoose";
require('dotenv').config();

const dbUrl:string = process.env.DB_URL || '';

const sanitizeEnvValue = (value: string) => {
    return value.trim().replace(/^['"]|['"]$/g, '');
};

const hasValidMongoUri = (value: string) => {
    return value.startsWith('mongodb://') || value.startsWith('mongodb+srv://');
};

const connectDB = async () => {
    const sanitizedDbUrl = sanitizeEnvValue(dbUrl);

    if (!sanitizedDbUrl) {
        console.log('DB connection skipped: DB_URL is missing in the environment variables.');
        return;
    }

    if (!hasValidMongoUri(sanitizedDbUrl)) {
        console.log('DB connection skipped: DB_URL must start with "mongodb://" or "mongodb+srv://".');
        return;
    }

    try {
        await mongoose.connect(sanitizedDbUrl, {
            dbName: 'lms'
        }).then((data: any) => {
            console.log(`Database connected with ${data.connection.host}`);
        });
    } catch (error: any) {
        if (error?.message?.includes('IP that isn\'t whitelisted')) {
            console.log('MongoDB Atlas rejected this connection because the current IP is not allowed. Add your current IP or allow 0.0.0.0/0 in Atlas Network Access.');
        } else {
            console.log(error.message);
        }

        setTimeout(connectDB, 5000);
    }

};

export default connectDB;