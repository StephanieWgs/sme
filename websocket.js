const WebSocket = require("ws");

let wss;

function initWebSocket(server) {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    //console.log("Client terhubung ke WebSocket");

    ws.on("close", () => {
      //console.log("Client terputus dari WebSocket");
    });
  });
}

// Fungsi untuk broadcast pesan ke semua client yang tersambung
function sendNotification(message) {
  if (!wss) return;
  const data = JSON.stringify({ message });

  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

module.exports = { initWebSocket, sendNotification };
