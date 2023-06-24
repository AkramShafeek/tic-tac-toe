import { useContext, useEffect, useState } from "react";
import { Context } from "../Context";
import { rootUrl } from "../config/rootUrl";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

var socket;

const OnlineGame = () => {
  const { roomStats, setRoomStats } = useContext(Context);
  const [isGameOn, setIsGameOn] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [mySymbol, setMySymbol] = useState('');
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [gameMatrix, setGameMatrix] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    socket = io(rootUrl);
    if (roomStats.isCreateRoom)
      socket.emit('create room', roomStats.roomId);
    else
      socket.emit('join room', roomStats.roomId);

    socket.on('init game', (gameState) => {
      setIsMyTurn(gameState.isMyTurn);
      setGameMatrix(gameState.matrix);
      setMySymbol(gameState.symbol);
      const newRoomStats = roomStats;
      roomStats.err = false;
      setRoomStats(newRoomStats);
    });

    socket.on('game over', (gameState) => {
      setIsGameOver(true);
      setWinner(gameState.gameStatus);
      setGameMatrix(gameState.matrix);
    })

    socket.on("room doesn't exist", () => {
      const newRoomStats = roomStats;
      roomStats.err = true;
      setRoomStats(newRoomStats);
      navigate('/onlineroom');
    });

    return () => {
      socket.emit('leave room', roomStats.roomId);
      socket.off('init game');
      socket.off('game over');
      socket.off("room doesn't exits");
      socket.disconnect();
    }
  }, []);

  useEffect(() => {
    socket.on('game state change', (gameState) => {
      setGameMatrix(gameState.matrix);
      setIsMyTurn(gameState.isMyTurn);
    });

    return () => {
      socket.off('game state change');
    }
  });


  const updateGameMatrix = (rowIndex, colIndex) => {
    if (gameMatrix[rowIndex][colIndex])
      return;
    if (isGameOver)
      return;
    if (!isMyTurn)
      return;
    const newMatrix = [];
    gameMatrix.forEach((row) => {
      newMatrix.push([...row]);
    })

    newMatrix[rowIndex][colIndex] = mySymbol;
    // setGameMatrix(newMatrix);
    const gameStatsClient = {
      isMyTurn: true,
      matrix: newMatrix
    }
    socket.emit('play turn', roomStats.roomId, gameStatsClient);
  }

  return (
    <div id="tictactoe">
      <div className="status">
        <p>room id: {roomStats.roomId}</p>
      </div>
      <div className="status">
        {!isGameOver && <p>{isMyTurn ? `Your turn (${mySymbol})` : `Opponent's turn (${mySymbol})`}</p>}
        {isGameOver && (winner === 'draw' ? <p>Game is a draw</p> : <p>{winner === mySymbol ? "You won !!" : "Opponent won :("}</p>)}
      </div>
      <div id="matrix">
        {gameMatrix && gameMatrix.map((row, rowIndex) => {
          return (
            <div key={rowIndex} id={"row" + rowIndex} className="row">
              {row.map((cell, colIndex) => {
                return <div
                  key={colIndex}
                  id={`(${rowIndex},${colIndex})`}
                  className="cell"
                  onClick={() => updateGameMatrix(rowIndex, colIndex)}>
                  {cell}
                </div>
              })}
            </div>
          )
        })}
      </div>      
      <button
        type="button"
        className="primary"
        onClick={() => { navigate('/') }}
        style={{ visibility: isGameOver ? 'visible' : 'hidden' }}>
        EXIT
      </button>
    </div>
  )
}

export default OnlineGame;