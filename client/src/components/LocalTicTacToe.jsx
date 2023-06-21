import { useEffect, useState } from "react";
import '../styles/tictactoe.css'
import winCheck from "../utils/winCheck";
const LocalTicTacToe = () => {
  const matrix = [["", "", ""], ["", "", ""], ["", "", ""]];
  const [gameMatrix, setGameMatrix] = useState(matrix);
  const [chance, setChance] = useState('X');
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState('');

  useEffect(() => {
    const status = (winCheck(gameMatrix));
    if (status !== 'continue') {
      setIsGameOver(true);
      setWinner(status);
    }

  }, [gameMatrix]);

  const updateGameMatrix = (rowIndex, colIndex) => {
    if (gameMatrix[rowIndex][colIndex])
      return;
    if (isGameOver)
      return;
    const newMatrix = [];
    gameMatrix.forEach((row) => {
      newMatrix.push([...row]);
    })
    newMatrix[rowIndex][colIndex] = chance;

    setChance(chance === "X" ? "O" : "X")
    setGameMatrix(newMatrix);
  }

  const reset = () => {
    setIsGameOver(false);
    setGameMatrix(matrix);
    setChance('X');
    setWinner('');
  }

  return (
    <div id="tictactoe">
      <div className="status">
        {!isGameOver && <p>{`${chance}'s chance`}</p>}
        {isGameOver && (winner === 'draw' ? <p>Game is a draw</p> : <p>{`${winner} wins`}</p>)}
      </div>
      <div id="matrix">
        {gameMatrix.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => {
                return <div
                  key={colIndex}
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
        onClick={reset}
        style={{ visibility: isGameOver ? 'visible' : 'hidden' }}>
        RESET
      </button>
    </div>
  )
}

export default LocalTicTacToe;