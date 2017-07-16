var app = require('http').createServer(handler);
app.listen(8088);
var io = require('socket.io').listen(app);
var redis = require('redis');
var fs = require('fs');
var request = require('request');

request('http://www.google.com', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred 
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
  console.log('body:', body); // Print the HTML for the Google homepage. 
});
 
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
 
/*var store = redis.createClient();
var pub = redis.createClient();
var sub = redis.createClient();
 
io.sockets.on('connection', function (socket) {
    sub.subscribe("chatting");
    sub.on("message", function (channel, message) {
        console.log("message received on server from publish ");
        socket.send(message);
    });
    socket.on("message", function (msg) {
        console.log(msg);
        if(msg.type == "chat"){
            pub.publish("chatting",msg.message);
        }
        else if(msg.type == "setUsername"){
            pub.publish("chatting","A new user is connected: " + msg.user);
            store.sadd("onlineUsers",msg.user);
        }
    });
    socket.on('disconnect', function () {
        sub.quit();
        pub.publish("chatting","User is disconnected :" + socket.id);
    });
     
  });*/
