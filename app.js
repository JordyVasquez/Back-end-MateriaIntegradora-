
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var io = require('socket.io');
var HashMap = require('hashmap');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/data";
var bodyParser = require('body-parser');

var connections = 0;

var app = express();
var server = http.createServer(app);
io = io.listen(server);
var map_ids_idsonido = new HashMap();
// all environments
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.set('port', process.env.PORT || 3331);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}  

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.createCollection("estructura_json_contenido", function(err, res) {
    if (err) throw err;
    console.log("Table estructura_json_contenido!");
  });
   db.createCollection("json_contenidos_subidos", function(err, res) {
    if (err) throw err;
    console.log("Table json_contenidos_subidos!");
    db.close();
  });
  });
app.post('/jsonConf', function(req, res){
  var json_confi = req.body.schema2;
console.log("Table json_contenidos_subidos!"+json_confi);
res.render('subir_cont', { title: 'Configuración Json',json:json_confi});
   // res.render('page_contenido', { title: 'Subir Contenido' });
  //res.render('index', { title: '1 Pantalla DEMO' });
});
app.get('/', function(req, res){
  res.render('index', { title: '1 Pantalla DEMO' });
});
app.get('/2v', function(req, res){
  res.render('test_secondScreen', { title: '2 Pantalla DEMO' });
});
app.get('/contenido', function(req, res){
  res.render('page_contenido', { title: 'Subir Contenido' });
});
app.get('/config_json', function(req, res){
  res.render('config_json', { title: 'Configuración Json' });
});
app.get('/subir_cont', function(req, res){
  //res.render('subir_cont', { title: 'Configuración Json',json: });
});
io.set('log level', 1);

// Escuchamos conexiones entrantes
io.sockets.on('connection', function (socket) {
  connections++;
  console.log('connected', connections);

   // socket.broadcast.emit('move', data);

    socket.on('opcion_2c', function (data) {
	  console.log('Sala:', data.sala);
	 console.log('Sala:', data.option);
	  io.to(data.sala).emit('opcion_1c',data.option);
  });
    socket.on('opciones', function (data) {
    // transmitimos el movimiento a todos los clienntes conectados
	  console.log('Opciones:', data.opciones);
	  io.to(data.sala).emit('op_second_screen',data.opciones);
  });
    socket.on('crearSala', function (data, callback) {
    // transmitimos el movimiento a todos los clienftes conectados
	  console.log('Sala:', data.sala);
    socket.join(data.sala);
	  callback({sala : data.sala});
  });
      socket.on('registrar_id_socket', function (data) {
    // transmitimos el movimiento a todos los clientes conectados
	  console.log('is socket:', data.id_s);
	  map_ids_idsonido.set( data.id_audio,data.id_s);

  });
      socket.on('unir_Sala', function (data) {
    // transmitimos el movimiento a todos los clientes conectados
	  console.log('unir_Sala:',data.sala);
	  	  console.log('Invitado:', data.invitado);
		  var ids=map_ids_idsonido.get(data.invitado)
socket.broadcast.to(ids).emit('invitacion_Sala', {sala:data.sala,invitado:data.invitado});
  });
  socket.on('disconnect', function() {
    connections--;
    console.log('connected', connections);
	 map_ids_idsonido.remove(socket.id)
    socket.broadcast.emit('connections', {connections:connections});
  });
});
app.get('/movies/:movieName', (req, res) => {
    const movieName = req.params.movieName;
   const movieFile = './movies/'+movieName;

  screen(movieFile,res,req);
 });
  function screen(path,res,req,ban) {
  var stat = fs.statSync(path);
  var total = stat.size;
  if (req.headers['range']) {
    var range = req.headers.range;
    var parts = range.replace(/bytes=/, "").split("-");
    var partialstart = parts[0];
    var partialend = parts[1];

    var start = parseInt(partialstart, 10);
    var end = partialend ? parseInt(partialend, 10) : total-1;
    var chunksize = (end-start)+1;
    console.log('RANGE : ' + start + ' - ' + end + ' = ' + chunksize);

    var file = fs.createReadStream(path, {start: start, end: end});

    res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
    
	    console.log('ALL: ');
	file.on('open', () => file.pipe(res));
	 console.log('ALL2: ');
		file.on('end', function () {  // done
    console.log("fin");

  });
   file.on('error', (streamErr) => res.end('errr'+streamErr));
  } else {
    console.log('ALL: ' + total);
    res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
	    var file = fs.createReadStream(path);
       file.on('open', () => file.pipe(res));
		file.on('end', function () {  // done
    console.log("fin"); 

  });
  }
					
}

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

