const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.set("port", (process.env.PORT || 3000))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.use((socket, next) => {
  socket.userId = socket.handshake.auth.userId;
  socket.name = socket.handshake.auth.name;
  console.log(`userId: ${socket.userId} name: ${socket.name}`)
  next();
});

io.on("connection", (socket) => {
  console.log("user connected", socket.name)
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userId: socket.userId,
      name: socket.name
    });
  }
  console.log("users", users)
  socket.emit("users", users);

  socket.broadcast.emit("user connected", {
    userId: socket.userId,
    name: socket.name
  });

  socket.on("disconnected", () => {
    console.log("user disconnected")
    socket.broadcast.emit("user disconnected", socket.userId);
  });

  socket.on("private message", ({ messageText, userIdDest }) => {
    // const socketDest = io.of("/").sockets.find(obj => { return obj.userId == userIdDest })
    // socket.to(socketDest.id).emit("private message", {
    socket.emit("private message", {
      messageText,
      // from: socket.userId,
    });
  });


  socket.on("on typing", function(typing) {
    io.emit("on typing", typing)
  })
});


server.listen(app.get("port"), () => {
  console.log("listening on *:3000");
});
