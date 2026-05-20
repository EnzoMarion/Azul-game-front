import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

export let myPlayerIndex = null;

socket.on('your_index', (index) => {
    myPlayerIndex = index;
});

export default socket;