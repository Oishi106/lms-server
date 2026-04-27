import { app } from './app';
import connectDB from './utils/db';
import http from 'http';
import { Server } from 'socket.io';
require('dotenv').config();

// 1. Create HTTP Server (Socket.io সরাসরি express app এর সাথে কাজ করে না, http server লাগে)
const server = http.createServer(app);

// 2. Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"], // আপনার ফ্রন্টএন্ড URL
        methods: ["GET", "POST"],
    },
});

// 3. Socket.io Logic
io.on("connection", (socket) => {
    console.log("⚡ A user connected:", socket.id);

    // ইউজার যখন মেসেজ পাঠাবে
    socket.on("sendMessage", (data) => {
        // মেসেজটি ডাটাবেসে সেভ করার লজিক এখানে কল করতে পারেন
        console.log("New Message:", data);

        // অ্যাডমিন এবং ইউজার উভয়কেই মেসেজটি রিয়েল-টাইমে পাঠিয়ে দেওয়া
        io.emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
        console.log("❌ User disconnected");
    });
});

// 4. Start Server
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    connectDB();
});