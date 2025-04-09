// src/socket.js
let socket;

export function initSocket(onMessageHandler) {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const port = window.location.port;
    socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);

    //socket.onmessage = onMessageHandler;

    socket.onopen = () => {
      console.log("WebSocket connected");
      socket.send(JSON.stringify({ type: 'playerUpdate' }));
    };

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === 'playerUpdate') {
          // Re-fetch current players when we get an update
          fetchCurrentPlayers();
        }
      };

    socket.onclose = () => {
        socket.send(JSON.stringify({ type: 'playerUpdate' }));
    };
  }

  return socket;
}

export function getSocket() {
  return socket;
}
