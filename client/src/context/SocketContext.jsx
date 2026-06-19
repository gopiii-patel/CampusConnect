import { createContext, useContext, useEffect } from "react";
import socket from "../socket";
import { AuthContext } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?._id) {
      socket.emit("userOnline", user._id);
      socket.emit("joinRoom", user._id);
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);