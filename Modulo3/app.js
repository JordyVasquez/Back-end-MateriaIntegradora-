
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var app_chat = require('express')();
var server1 = require('http').Server(app_chat);
var io = require('socket.io')(server1);
var request = require('request');
var Filter = require("bad-words")
var customFilter = new Filter({ placeHolder: 'x'});
var fs = require('fs');
var id_session = null;
 customFilter.addWords(['Asesinato','asno','bastardo','Bollera','Cabron','Cabrón','Caca','Chupada','Chupapollas','Chupetón','concha','Concha de tu madre','Coño','Coprofagía','Culo','Drogas','Esperma','Follador','Follar','Gilipichis','Gilipollas','paja','Heroína','Hijaputa','Hijoputa','Idiota','Imbécil','infierno','Jilipollas','Kapullo','Lameculos','Maciza','Macizorra','maldito','Mamada','Marica','Maricón','Mariconazo','martillo','Mierda','Nazi','Orina','Pedo','Pervertido','Pezón','Pinche','Pis','Prostituta','Puta','Racista','Ramera','Sádico','Semen','Sexo','Sexo oral','Soplagaitas','Soplapollas','Tetas grandes','Tía buena','Travesti','Trio','Verga','vete a la mierda','Vulva']);
 app.set('port', process.env.PORT || 8080);
server1.listen(9999);
io.sockets.on('connection', function(socket) {
  socket.on('join', function(channel, ack) {
    socket.join(channel);
    console.log("Se ha unido al canal: "+channel);
    
  });
  
  socket.on('message', function(msg, ack) {
    console.log("msg.canal: "+msg.canal+" msg.mensaje: "+msg.mensaje);
    ;
    socket.broadcast.to(msg.canal).emit('broadcast', {msm:customFilter.clean(msg.mensaje),url:msg.url_imagen});
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
