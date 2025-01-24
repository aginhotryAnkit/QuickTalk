const express = require('express');
const http = require('http');
const io = require('socket.io');
const app = express();


require('dotenv').config();
app.use(express.json());

const server = http.createServer(app);
const socketIo = io(server);

socketIo.on("connection", (socket)=>{
    console.log("New Connection");

    socket.on("message", (msg)=>{
        console.log("Message: ",msg);
    });

    socket.on('disconnect',()=>{console.log("client disconnected");});

})

const chatNameSpace = socketIo.of("/chat");
chatNameSpace.on("connection",(chat)=>{
    console.log("client join to chat name space");
});

app.get("/check", (req, res)=>{
    res.send("Server is up");
})


server.listen(process.env.PORT, (req, res)=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});