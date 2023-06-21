import { useContext, useEffect, useState } from "react";
import { Context } from "../Context";
import { useNavigate } from "react-router-dom";

const Online = () => {
  const [name, setName] = useState('');
  const [isJoinRoom, setIsJoinRoom] = useState(false);
  const [joiningRoom, setJoiningRoom] = useState('');
  const { roomId, setRoomId } = useContext(Context);
  const navigate = useNavigate();

  const handleNameChange = (event) => {
    setName(event.target.value);
  }
  const handleJoinRoomClick = () => {
    if (!name) {
      console.log("Enter name first");
      return;
    }
    setIsJoinRoom(true);
  }
  const handleCreateRoomClick = () => {
    if (!name) {
      console.log("Enter name first");
      return;
    }
    setRoomId("mysecretwakandaroom");
    navigate('/onlinegame');
  }
  const handleJoinRoom = () => {
    if (!name || !joiningRoom) {
      console.log("Enter all inputs")
      return;
    }
    setRoomId(joiningRoom);
    navigate('/onlinegame');
  }
  const handleRoomInput = (event) => {
    setJoiningRoom(event.target.value);
  }

  return (
    <div className="d-flex f-col align-items-center gap-2">
      <input type="text" className="name" placeholder="Enter your name" value={name} onChange={handleNameChange} />
      {isJoinRoom && <input type="text" className="name" placeholder="Enter room id" value={joiningRoom} onChange={handleRoomInput} />}
      {isJoinRoom && <button type="button" className="primary" onClick={handleJoinRoom}>Join</button>}
      {isJoinRoom && <button type="button" className="primary" onClick={() => { setIsJoinRoom(false) }}>Cancel</button>}
      {!isJoinRoom && <button type="button" className="primary" onClick={handleCreateRoomClick}>Create room</button>}
      {!isJoinRoom && <button type="button" className="primary" onClick={handleJoinRoomClick}>Join room</button>}
    </div >
  )
}

export default Online;