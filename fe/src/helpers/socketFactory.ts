import { io } from 'socket.io-client';

const initializeSocket = (token: string) => {
  const socket = io(`${process.env.REACT_APP_BASE_API_URL}`, {
    query: { token }
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
      socket.io.opts.query = { token: localStorage.getItem('access_token') };
      socket.connect();
    }
  });

  socket.on('error', async (error) => {
    console.error('Socket error:', error);
    if (error === 'Invalid token' || error === 'No token provided') {
      const newToken = localStorage.getItem('access_token');
      if (newToken) {
        socket.io.opts.query = { token: newToken };
        socket.connect();
      } else {
        console.error('Failed to refresh token');
      }
    }
  });

  return socket;
}

const initialToken = localStorage.getItem('access_token');

const socket = initializeSocket(initialToken || '');

export default socket;