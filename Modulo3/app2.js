var app = require('http').createServer(handler);
app.listen(8088);

var express = require('express');
var app = express()
var server = app.listen(3001);
var io = require('socket.io').listen(server);



var fs = require('fs');
var id_session = null;
 
function handler(req,res){
    fs.readFile(__dirname + '/index.html', function(err,data){
        if(err){
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        console.log("Listening on port 8088");
        res.end(data);
    });
}
 
io.sockets.on('connection', function(socket) {
  socket.on('join', function(channel, ack) {
    socket.join(channel);
    console.log("Se ha unido al canal: "+channel);
    
  });
  
  socket.on('message', function(msg, ack) {
    console.log("msg.canal: "+msg.canal+" msg.mensaje: "+msg.mensaje);
    socket.broadcast.to(msg.canal).emit('broadcast', msg.mensaje);
    ack();
 });
});
    
