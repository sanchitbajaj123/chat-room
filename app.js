const exp = require('express');
const soc = require('socket.io');
const path = require('path');
const app = exp();
const hostname='0.0.0.0'
const server = app.listen(process.env.PORT || 3000,hostname, () => {
    console.log("listening");
});
const io = soc(server);

app.use(exp.static(path.join(__dirname)));

io.on('connection', (socket) => {
    // senderName is declared here, within the scope of the connection handler function
    console.log("A user connected");
    var senderName; // Using a normal var declaration

    socket.on('name msg', (msg) => {
        io.emit('name chat', msg);
    });

    socket.on('chat message', (name, msg) => {
        // Within this function scope, senderName refers to the variable declared above
        senderName = name; // Store sender's name in the var
        io.emit('chat', name, msg);
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
        console.log("A user disconnected");
        // Emit the disconnect event with the stored name
        io.emit('user disconnected', senderName);
    });
});
