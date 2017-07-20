const EVENT = {
  status : 'status',
  message : 'message',
  connexion : 'connexion',
  leave : 'leave'
};

var http = require('http');
var fs = require('fs');
var ent = require('ent');

var server = http.createServer(function(req, res) {
  fs.readFile('./index.html', 'utf-8', function(error, content) {
    if (error) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end(content);
  });
});

var io = require('socket.io').listen(server);
io.on('connection', function (socket) {

  socket.emit(EVENT.status, { content: 'You are connected'});

  /**
   * Send message to all users
   */
  socket.on(EVENT.message, function(message) {
    message = ent.encode(message);
    socket.emit(EVENT.message, {content: message, nickname: socket.nickname});
    socket.broadcast.emit(EVENT.message, {content: message, nickname: socket.nickname});
  });


  /**
   * user connect to the server
   */
  socket.on(EVENT.connexion, function(data){
    socket.nickname = ent.encode(data);
    socket.broadcast.emit(EVENT.status, { content: socket.nickname + ' join the chat'});
  });

  /**
   * user leave the chat
   */
  socket.on(EVENT.leave, function(data){
    socket.broadcast.emit(EVENT.status, { content: socket.nickname + ' is disconnected'});
    socket.disconnect(true);
  });
});

server.listen(8080);