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

//var socket = ioc.connect('http://localhost:3000');
var schema = null;
var socket = ioc.connect('http://192.168.74.1:3331');
socket.emit('session', {
                        'session': id_session
                    });
/*for(var i = 0; i < 10; i++){
var start = new Date();  
socket.on("ips", function (data) {
        schema = JSON.stringify(data.ips);
        console.log("Res: "+schema);
        var responseTime = new Date() - start;
        console.log('responseTime: '+ responseTime);
    });


}*/

/*request('http://localhost:3331/wonder2.jpg', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred 
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
  //console.log('body:', body); // Print the HTML for the Google homepage. 
});
for(var i = 0; i < 5; i++){
  request.get({
    url : 'http://localhost:3000/wonder1.jpg',
    time : true
  },function(err, response){
    console.log('Request time in ms', response.elapsedTime);
  });
}*/

/*request('http://localhost:3331/ips', function (error, response, body) {
  console.log('error:', error);
  console.log("response: "+(response.body));
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
  console.log("response time: "+(response.elapsedTime));
});*/
var promedio=0;
var total=0;
var elmt = [];
var band = false;
var i=0;
var throughput=0;
var num_veces = 2;
//var num_veces = 0;
//var iteraciones = 10;
/*for (j = 1; j <= iteraciones; j++) {
  num_veces=num_veces+1000
}*/
/*for(i = 1; i <= num_veces; i++){
  
    request.get({
    url : 'http://localhost:80/ips',
    time : true, 
    qs :  { num_veces: i, iteraciones: num_veces}
    },function(err, response){
      //console.log("response: "+JSON.stringify(JSON.parse(response.body).num_veces));
      //console.log('Request time in ms', response.elapsedTime);
      total=total+response.elapsedTime;
      if((JSON.parse(response.body).num_veces)==num_veces){

        throughput = total/num_veces;
        console.log("prom: "+throughput)
      }
      //console.log("total: "+total);
    });

 
  
  
}*/


for(i = 1; i <= num_veces; i++){
  
    request.get({
    url : 'http://192.168.43.55:80/ips',
    time : true, 
    qs :  { num_veces: i, iteraciones: num_veces}
    },function(err, response){
      console.log("response: "+JSON.stringify(JSON.parse(response.body)));
      //console.log('Request time in ms', response.elapsedTime);
      
        //console.log("prom: "+throughput)
      }
      //console.log("total: "+total);
    );

 
  
  
}

/*while(1){
  if(band == true){
    console.log("enter: "+elmt.length);
    for(var j = 0; j < elmt.length; j++) {
      total += elmt[j];
      console.log("j: "+elmt[j]);
    }
    console.log("long: "+elmt.length);
    console.log("promedio: "+(total / elmt.length));
    break;
  }
  

}*/

/*console.log("METODO 2");
var promedio=0;
var j=0;
var responseTime=0
for(var i = 0; i < 10; i++){
  j++;
  var start = new Date();
  request('http://localhost:3331/ips', function(err, res, body) {
    //console.log("response: "+(res.body));
    responseTime = new Date() - start;
    
    console.log('responseTime: '+responseTime);
    //next(err, res, body);
  });

  promedio = promedio+responseTime;
}
console.log("promedio: "+(promedio/j))*/