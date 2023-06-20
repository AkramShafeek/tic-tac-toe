import TicTacToe from "./components/TicTacToe";

function App() {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)'
  }
  return (
    <div style={style}>
      <TicTacToe />
    </div>
  );
}

export default App;
