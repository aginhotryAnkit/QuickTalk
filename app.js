const express = require('express');
const http = require('http');
const io = require('socket.io');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');

// Middleware to parse URL-encoded bodies (like form data)
app.use(express.urlencoded({ extended: true }));


require('dotenv').config();

//middlewares
app.use(express.json());
app.use(express.static('public'));

//app configuration
app.set('view engine', 'ejs');
app.set('views', './src/views/pages');


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


//other parts
app.get("/", (req, res)=>{
    res.render('register');
});


// register a user 
app.post("/v1/register", (req, res)=>{
    const { email, password, confirmPassword } = req.body;
    res.send(req.body);
});


app.get("/login", (req, res)=>{
    res.render('login');
});
