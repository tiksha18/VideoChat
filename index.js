const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
    cors : {
        origin : "*",  // allows access from all origins
        methods : ["GET", "POST"]
    }
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Server is running");
});

// backend socket.io working 
// connecting to a socket
io.on('connection', (socket) => {  // sockets are used for realtime data transmission , that data could be images, audio, video

    socket.emit('me', socket.id);  // it will give(emit) me my own socket id after connection opens
    
    socket.on('disconnect', () => {  // at disconnection , the msg emitted inside the callbackback function will be displayed
        socket.broadcast.emit("callended");
    });

    socket.on("calluser", ({ userToCall, signalData, from, name }) => {  // on calling calluser func from frontend, some data will passed in the callback function
        io.to(userToCall).emit("calluser", { signal : signalData, from, name });
    });

    socket.on("answercall", (data) => { 
        io.to(data.to).emit("callaccepted", data.signal);
    });
})

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});