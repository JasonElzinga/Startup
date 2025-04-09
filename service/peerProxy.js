const { WebSocketServer } = require('ws');

function peerProxy(server) {
  const socketServer = new WebSocketServer({ server });

  socketServer.broadcast = function broadcast(message) {
    socketServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  socketServer.on('connection', (socket) => {
    socket.isAlive = true;
    console.log("Alive");

    socket.on('message', function message(data) {
      console.log("IN the on message in PeerProxy");
      socketServer.clients.forEach((client) => {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'playerUpdate' }));
          console.log("sent to all players");
        }
      });
    });

    socket.on('pong', () => {
      socket.isAlive = true;
    });

    socket.on('switch', () => {
      socketServer.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'switchToChoose' }));
        }
      });
    });


    socket.on('close', () => {
      console.log('Client disconnected');
      socketServer.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'playerUpdate' }));
        }
      });
    });
  });

  setInterval(() => {
    socketServer.clients.forEach((client) => {
      if (client.isAlive === false) {
        console.log('Client disconnected');
        client.terminate();
  
        // Notify other clients about the disconnect
        socketServer.clients.forEach((c) => {
          if (c.readyState === WebSocket.OPEN) {
            c.send(JSON.stringify({ type: 'playerUpdate' }));
          }
        });
  
        return;
      }
  
      client.isAlive = false;
      client.ping();
    });
  }, 10000);

  return socketServer;
}

module.exports = { peerProxy };
