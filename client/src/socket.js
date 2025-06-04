// client/src/socket.js
import { io } from 'socket.io-client';

// Point to your backend. 
// NOTE: Our server is running on port 4000, React dev server on 3000.
export const socket = io('http://localhost:4000', {
  autoConnect: false, // we will call socket.connect() manually 
});
