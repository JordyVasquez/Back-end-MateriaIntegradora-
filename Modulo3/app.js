
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var app_chat = require('express')();
var server1 = require('http').Server(app_chat);
var io = require('socket.io')(server1);
var request = require('request');
  server1.listen(3000);

var fs = require('fs');
var id_session = null;
 
 app.set('port', process.env.PORT || 8080);
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
var METADATA_NETWORK_INTERFACE_URL = 'http://metadata/computeMetadata/v1/' +
    '/instance/network-interfaces/0/access-configs/0/external-ip';

app.get('/ips', function(req, res) {
  getExternalIp(function(externalIp) {
                     res.send(externalIp);

                });
               
 
});

function getExternalIp(cb) {
    var options = {
        url: METADATA_NETWORK_INTERFACE_URL,
        headers: {
            'Metadata-Flavor': 'Google'
        }
    };

    request(options, function(err, resp, body) {
        if (err || resp.statusCode !== 200) {
            console.log('Error while talking to metadata server, assuming localhost');
            return cb('localhost');
        }
        return cb(body);
    });
}
server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
}); 
