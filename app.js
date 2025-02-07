const express = require('express');
const http = require('http');
const io = require('socket.io');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const authRoute = require('./src/routes/authRoutes');
const userRoute = require('./src/routes/userRoutes');
const chatRoute = require('./src/routes/chatRoutes');
const connectDB = require('./src/config/db');
const authMiddleware = require('./src/middlewares/authMiddleware');
const validateMiddleware = require('./src/middlewares/validateMiddleware');
const loggerMiddleware = require('./src/middlewares/loggerMiddleware');

require('dotenv').config();

// Middleware to parse URL-encoded bodies (like form data)
app.use(express.urlencoded({ extended: true }));

//middlewares
app.use(express.json());
app.use(express.static('public'));
app.use("/v1/auth",authMiddleware, authRoute);
app.use("/v1/user", userRoute);
app.use("v1/chat", chatRoute);

//app configuration
app.set('view engine', 'ejs');
app.set('views', './src/views/pages');

//connect database
connectDB();

const server = http.createServer(app);
const socketIo = io(server);

//entry point of the application
app.get("/", (req, res)=>{
    res.render('register');
});

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
    res.send("Hello World!");
});

//!server up code
server.listen(process.env.PORT, (req, res)=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});


// // register a user 
// app.post("/v1/register", (req, res)=>{
//     const { email, password, confirmPassword } = req.body;
//     res.send(req.body);
// });


app.get("/login", (req, res)=>{
    res.render('login');
});
