require('dotenv').config();
const express = require('express');
const app = express();


app.get('/', (req, res) => {
  res.send("Hello World");
})


const corsOriginsDevelopment = ['http://localhost:3000', 'http://192.168.43.215:3000'];
const corsOriginsProduction = [''];


const PORT = process.env.PORT || 4000;

const startServer = () => {
  var i = 0;
  var interval;
  const server = app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
  const socketio = require('socket.io');
  const io = socketio(server, {
    pingTimeout: 60000,
    cors: {
      origin: process.env.NODE_ENV === 'production' ? corsOriginsProduction : corsOriginsDevelopment,
    },
  });

  io.on("connection", (socket) => {
    socket.on('create room', (roomId) => {
      console.log(`room created: ${roomId}`);
      socket.join(roomId);
    })
    socket.on('join room', (roomId) => {
      console.log(`joined room: ${roomId}`);
      socket.join(roomId);
    })
    socket.on('leave room', (roomId) => {
      console.log(`left room: ${roomId}`);
      socket.leave(roomId);
    })
    socket.on('change btn color', () => {
      socket.in("mysecretwakandaroom").emit("click");
      socket.emit("click")
    })
    socket.on('disconnect',()=>{
      console.log('disconnecting ' + socket.id)
      socket.disconnect();
    })
    socket.off("join room", () => {
      socket.leave(roomId);
    })

  })
}


startServer();
