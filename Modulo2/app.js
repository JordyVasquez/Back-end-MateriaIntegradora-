var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require('mongoose');
var redis = require("redis");

var pub = redis.createClient();
var sub = redis.createClient();

var server = app.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});  
var socket = require('socket.io')
var io = socket(server);


io.sockets.on('connection', function(socket) {  
  console.log('Alguien se ha conectado con Sockets');
   });
    
app.get('/hello', function(req, res) {  
  res.status(200).send("Hello World!");
});

/*var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/data";

// Connection to DB
/*mongoose.connect('mongodb://localhost/prueba', function(err, res) {
  if(err) throw err;
  console.log('Connected to Database');
});*/

mongoose.connect('mongodb://root:1234@104.197.197.72:27017/admin', function(err, res) {
  if(err) throw err;
  console.log('Connected to Database');
});


// Middlewares
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static('public'));



// Import Models and controllers
var models     = require('./models/tvshow')(app, mongoose);
var TVShowCtrl = require('./controllers/tvshows');



// Example Route
var router = express.Router();
router.get('/', function(req, res) {
  res.send("Hello world!");
});
app.use(router);

// API routes
var tvshows = express.Router();

tvshows.route('/tvshows')
  .get(TVShowCtrl.findAllTVShows)
  .post(TVShowCtrl.addTVShow);

tvshows.route('/tvshows/:id')
  .get(TVShowCtrl.findById)
  .put(TVShowCtrl.updateTVShow)
  .delete(TVShowCtrl.deleteTVShow);

app.use(tvshows);
  
/*MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var myobj = {
        title: "LOST",
        year: 2004,
        country: "USA",
        poster: "http://ia.media-imdb.com/images/M/MV5BMjA3NzMyMzU1MV5BMl5BanBnXkFtZTcwNjc1ODUwMg@@._V1_SY317_CR17,0,214,317_.jpg",
        seasons: 6,
        genre: "Sci-Fi",
            summary: "The survivors of a plane crash are forced to live with each other on a remote island, a dangerous new world that poses unique threats of its own."
      }
      //var myobj = { username: "jg", password: "123"};
      db.collection("TVShow").insert(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 record inserted");
      db.close();
      });
  });*/

app.get('/:name', function (req, res, next) {

  var options = {
    root: __dirname + '/public/uploads/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  var fileName = req.params.name;
  res.sendFile(__dirname + '/uploads/'+fileName, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
  

});

sub.subscribe("analytics");
sub.on("subscribe", function(channel, count) {
    console.log("Subscribed to " + channel + ". Now subscribed to " + count + " channel(s).");
    pub.publish("analytics", "Bon cul, petite salope");
});

sub.on("message", function(channel, message) {
    console.log("Message from channel " + channel + ": " + message);
});




// Start server
/*server.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});*/
