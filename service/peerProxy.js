const { WebSocketServer } = require('ws');

function peerProxy(server) {
  const socketServer = new WebSocketServer({ server });

  // Add a broadcast method to the socketServer
  socketServer.broadcast = function broadcast(message) {
    socketServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  socketServer.on('connection', (socket) => {
    socket.isAlive = true;
    console.log("Alive")
    // Whenever a message is received, broadcast a simple notification
    socket.on('message', function message(data) {
      console.log(data)
      console.log("IN the message part")
      // Instead of forwarding the data directly, notify all other clients
      socketServer.clients.forEach((client) => {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'playerUpdate' }));
        }
      });
    });

    // Maintain alive status with ping/pong
    socket.on('pong', () => {
      socket.isAlive = true;
    });
  });

  // Heartbeat
  setInterval(() => {
    socketServer.clients.forEach(function each(client) {
      if (client.isAlive === false) return client.terminate();
      client.isAlive = false;
      client.ping();
    });
  }, 10000);

  return socketServer;
}

module.exports = { peerProxy };