import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinTicketRoom: (ticketId: string) => void;
  leaveTicketRoom: (ticketId: string) => void;
  joinAgentDashboard: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(window.location.origin.replace(':5173', ':5000'), {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('[SocketContext] Connected to real-time server:', newSocket.id);
      setIsConnected(true);
      if (user && (user.role === 'agent' || user.role === 'admin')) {
        newSocket.emit('join_agent_dashboard');
      }
    });

    newSocket.on('disconnect', () => {
      console.log('[SocketContext] Disconnected from server');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const joinTicketRoom = (ticketId: string) => {
    if (socket && ticketId) {
      socket.emit('join_ticket', ticketId);
    }
  };

  const leaveTicketRoom = (ticketId: string) => {
    if (socket && ticketId) {
      socket.emit('leave_ticket', ticketId);
    }
  };

  const joinAgentDashboard = () => {
    if (socket) {
      socket.emit('join_agent_dashboard');
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, joinTicketRoom, leaveTicketRoom, joinAgentDashboard }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
