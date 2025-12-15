// libs/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI in .env.local");
}

// cache để Next.js hot-reload không mở nhiều connection
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI as string)
            .then((mongoose) => mongoose);
        console.log("đã kết nối với mongo")
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
