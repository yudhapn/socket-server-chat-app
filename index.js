const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("connect user", function(user) {
    io.emit("connect user", user)
  });

  socket.on("on typing", function(typing) {
    io.emit("on typing", typing)
  })

  socket.on("chat message", function(message) {
    io.emit("chat message", message)
  })

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
