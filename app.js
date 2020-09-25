var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = {};

app.get('/', function (req, res) {
  res.send('Servidor rodando');
});

io.on('connection', function (client) {
  client.on('join', function (name) {
    console.log('Entrou: ' + name);
    clients[client.id] = name;
    client.emit('Atualização', 'Você se conectou ao servidor.');
    client.broadcast.emit('Atualização', name + ' se conectou ao servidor.');
  });

  client.on('send', function (msg) {
    console.log('Mensagem: ' + msg);
    client.broadcast.emit('chat', clients[client.id], msg);
  });

  client.on('disconnect', function () {
    console.log('Desconectado');
    io.emit('Atualização', clients[client.id] + ' deixou o servidor.');
    delete clients[client.id];
  });
});

http.listen(3000, function () {
  console.log('Ouvindo na porta 3000');
});
