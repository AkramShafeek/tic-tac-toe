import { createContext } from "react";


const roomStats = {
  isCreateRoom: false,
  roomId: ""
}
export const Context = createContext({ roomStats });
