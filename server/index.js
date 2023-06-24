require('dotenv').config();
const express = require('express');
const app = express();
const winCheck = require('./util/winCheck');
const path = require('path');

app.use('/', express.static(path.join(__dirname, './public/build/')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/build', 'index.html'));
})

const corsOriginsDevelopment = ['http://localhost:3000', 'http://192.168.43.215:3000'];
const corsOriginsProduction = [''];


const PORT = process.env.PORT || 4000;

const startServer = () => {
  var i = 0;
  var interval;
  const server = app.listen(PORT, ['192.168.43.215', 'localhost'], () => console.log(`Server is listening on port ${PORT}`));
  const socketio = require('socket.io');
  const io = socketio(server, {
    pingTimeout: 60000,
    cors: {
      origin: process.env.NODE_ENV === 'production' ? corsOriginsProduction : corsOriginsDevelopment,
    },
  });

  io.on("connection", (socket) => {
    socket.on('create room', (roomId) => {
      const gameState = {
        isMyTurn: true,
        matrix: [["", "", ""], ["", "", ""], ["", "", ""]],
        symbol: 'X'
      }
      console.log(`room created: ${roomId}`);
      socket.join(roomId);
      socket.emit('init game', gameState);
    })
    socket.on('join room', (roomId) => {
      if (!io.sockets.adapter.rooms.get(roomId)) {
        socket.emit("room doesn't exist");
      }
      const gameState = {
        isMyTurn: false,
        matrix: [["", "", ""], ["", "", ""], ["", "", ""]],
        symbol: 'O'
      }
      console.log(`joined room: ${roomId}`);
      socket.join(roomId);
      socket.emit('init game', gameState);
    })
    socket.on('leave room', (roomId) => {
      console.log(`left room: ${roomId}`);
      socket.leave(roomId);
    })

    socket.on('play turn', (roomId, clientGameState) => {
      /**
       * clientGameState contains isMyTurn property which is true
       * sending this state to the opponent would provide opponent's turn
       * before sending back to the current sender, toggle isMyTurn to false
       */

      /**
       * winCheckStatus return the following:
       * X - player with X symbol won 
       * O - player with O symbol won
       * draw - game over and draw
       * continue - game can continue
       */
      const winCheckStatus = winCheck(clientGameState.matrix);

      if (winCheckStatus == 'continue') {
        socket.in(roomId).emit('game state change', clientGameState);
        clientGameState.isMyTurn = false;
        socket.emit('game state change', clientGameState);
      }
      else {
        const gameState = {
          gameStatus: winCheckStatus,
          matrix: clientGameState.matrix
        }
        socket.in(roomId).emit('game over', gameState);
        socket.emit('game over', gameState);
      }
    })

    socket.on('disconnect', () => {
      console.log('disconnecting ' + socket.id)
      socket.disconnect();
    })
    socket.off("join room", () => {
      socket.leave(roomId);
    })

  })
}


startServer();
