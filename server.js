const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
    console.log('New client connected.');

    const broadcast = data => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    };

    ws.send(JSON.stringify({ type :"message", user: "server", message: "Coucou toi !" }));

    ws.on('message', (msg) => {
        const data = JSON.parse(msg.toString());
        ws.user = data.user;
        broadcast(data);
    });

    ws.on('close', () => {
        broadcast({ type: "leave",
            user: ws.user,
            content:"left the chat",
        });
        console.log('User left');
    });
});