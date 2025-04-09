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

    socket.on('message', (data) => {
      
      const dataStr = data.toString(); 
    
      try {
        const parsedData = JSON.parse(dataStr);
        console.log("Parsed Data:", parsedData);
        console.log("Data Type:", parsedData.type);
    

        if (parsedData.type === 'playerUpdate') {

          socketServer.clients.forEach((client) => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: 'playerUpdate' }));
              console.log("sent to all players");
            }
          });
        }
        else if (parsedData.type === 'switch') {
          socketServer.clients.forEach((client) => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: 'switch' }));
              console.log("sent to all players");
            }
          });
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    socket.on('pong', () => {
      socket.isAlive = true;
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
