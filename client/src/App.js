import "./styles/App.css"
import "./styles/online.css"
import Home from "./pages/Home";
import Local from "./components/Local";
import Online from "./components/Online";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Context } from "./Context";
import { useState } from "react";
import OnlineGame from "./components/OnlineTicTacToe";

function App() {
  const [roomStats, setRoomStats] = useState({ isCreateRoom: false, roomId: "" });
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)'
  }
  return (
    <Context.Provider value={{ roomStats, setRoomStats }}>
      <BrowserRouter>
        <div style={style}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/local" element={<Local />} />
            <Route path="/onlineroom" element={<Online />} />
            <Route path="/onlinegame" element={<OnlineGame />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Context.Provider>
  );
}

export default App;
