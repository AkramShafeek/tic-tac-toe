import { useContext, useEffect, useState } from "react";
import { Context } from "../Context";
import { rootUrl } from "../config/rootUrl";
import io from "socket.io-client";

var socket;

const OnlineGame = () => {
  const { roomId, setRoomId } = useContext(Context);
  const [color, setColor] = useState(false);

  useEffect(() => {
    socket = io(rootUrl);
    socket.emit('join room', roomId);
    return () => {
      socket.emit('leave room', roomId);
      socket.disconnect();
    }
  }, []);

  useEffect(() => {    
    socket.on('click', () => {
      setColor(!color);
    })
    return () => {      
      socket.off('click')
    }
  });
  return (
    <div>
      <button
        className="primary"
        style={{ backgroundColor: color ? 'rgb(89, 133, 214)' : '#393257', color: color ? 'white' : '#8978ce' }}
        onClick={() => socket.emit('change btn color')}>Click me</button>
      <p>{roomId}</p>
    </div>
  )
}

export default OnlineGame;