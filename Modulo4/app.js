var app = require('http').createServer(handler);
app.listen(8088);
var io = require('socket.io').listen(app);;
var fs = require('fs');
var request = require('request');
var id_session = Math.round(Date.now()*Math.random()/100000);
var ioc = require( 'socket.io-client' );

 
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

var socket = ioc.connect('http://localhost:3000');
socket.emit('session', {
                        'session': id_session
                    });


request('http://localhost:3000/wonder2.jpg', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred 
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
  //console.log('body:', body); // Print the HTML for the Google homepage. 
});
   