/**
 * Module dependencies.
 */
var express = require('express');
var crypto = require('crypto');
var md5 = require('md5');
var CryptoJS = require("crypto-js");
var sha512 = require('js-sha512');
var http = require('http');
var path = require('path');
var HashMap = require('hashmap');
var cons = require('consolidate');
var path = require("path");
var request = require('request');
 var fs = require('fs')
const lzstring = require('./public/js/LZString');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://root:1234@35.192.154.130:27017/admin";
//var url = "mongodb://localhost:27017/data";
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var urlp = require("url");
var connections = 0;
var salt = '';
var passwordData = ''; //mongorestore --host 35.192.154.130  --port 27017 --authenticationDatabase admin --username root --password 1234 -d admin data
var passwordHash = '';//create default-allow-websockets --allow tcp:80 --target-tags websocket --description "Allow websocket traffic on port 80"
var nombre = '';
var passAdminHash = '';
var resultDB = '';
var resultStr = '';
var finalJson = '';
var userDB = '';
var app = express();
var server = http.createServer(app);
var app_chat = require('express')();
var server1 = require('http').Server(app_chat);
var io = require('socket.io')(server1);
var map_ids_idsonido = new HashMap();
var hash_cont_conectados = new HashMap();
var flagSession = false;
var cerrar = false;
var now = null;
var expired = null;
var usuarios_sincronizados = 0;
var map_ids_contenido_sala = new HashMap();
app.engine('.html', cons.jade);
app.set('view engine', 'html');
// all environments
app.use(bodyParser.json()); // support json encoded bodies

app.use(express.cookieParser());
//app.use(express.session({secret: 'mi secreto'}));
/*app.use(express.session({
    secret  : 'sdfsdSDFD5sf4rt4egrt4drgsdFSD4e5',
    //store   : new storage({ client : conn, cleanup: false }),
    cookie  : { maxAge  : new Date(Date.now() + (20000)) },
    
}));*/
app.use(cookieParser('my secret here'));
const minute = 10000 * 10000;
const firebaseConfig = {
    apiKey: 'AIzaSyAlNrvWc7IjmhdLrlm3L26uZRcohhCPOf0',
    authDomain: 'config-admin.firebaseapp.com',
    databaseURL: 'https://config-admin.firebaseio.com',
    projectId: 'config-admin',
    // A bucket is a container for objects (files).
    storageBucket: 'config-admin.appspot.com',
    messagingSenderId: '82402474237'
}

//Express 4
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: false
}));

// Set Content-Type for all responses for these routes
app.use((req, res, next) => {
    res.set('Content-Type', 'text/html');
    next();
});
// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

ipdinamicas();

/*var passwordMD5 = md5("awesome6");
console.log("awesome6: "+passwordMD5);
MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var myobj = { username: "javier", password: passwordMD5};
      db.collection("users").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 record inserted");
      db.close();
      });
  });*/

MongoClient.connect(url, function(err, db) {
    if (err) {
        throw err;
        server1.listen(9999);
        console.log("puerto para socket: 9999")

    }
    var query = {
        name: "config"
    };
    db.collection("Json_Config_2_Pantalla").find(query).toArray(function(err, result) {
        if (err) {

            throw err;
            server1.listen(9999);
            console.log("puerto para socket: 9999")
        } else if (result.length > 0) {
            server1.listen(JSON.parse(lzstring.decompressFromBase64(result[0].json)).IP_Servidor_Config.puertos.socket)
            console.log("puerto para socket:" + JSON.parse(lzstring.decompressFromBase64(result[0].json)).IP_Servidor_Config.puertos.socket)
            var url2 = JSON.parse(lzstring.decompressFromBase64(result[0].json)).IP_Servidor_Chat_Broadcast.url
            var prt=JSON.parse(lzstring.decompressFromBase64(result[0].json)).IP_Servidor_Chat_Broadcast.puertos.socket;
   


        } else {
            server1.listen(9999);
        
            console.log("puerto para socket: 9999")

        }
        console.log(result.length);
        db.close();
    });
});


app.get('/login', function(req, res) {
    //res.render('login_admin', { title: 'Login Admin' });
    res.render('login_admin', {
        title: 'Login Admin',
        band: 'false',
        msm: 'OK',
        username: ''

    });
});

app.get('/', function(req, res) {
    res.render('login_admin', {
        title: 'Login Admin',
        band: 'false',
        msm: 'OK',
        username: ''

    });
});

app.get('/credenciales', function(req, res) {
    //res.render('login_admin', { title: 'Login Admin' });
    res.render('credenciales', {
        title: 'Cambiar_password'
        
    });
});

app.get('/escenas', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        console.log("MongoDB");
        if (err) {
            throw err;
            res.render('config_json', {
                title: 'Configuración Json',
                msm: 'error al conectar con la bse mongodb',
                json: ''
            });

        }
        var query = {
            name: "config"
        };
        db.collection("Contenidos").find({}).toArray(function(err, result) {
            console.log("db");
            if (err) {
                console.log("err");
                res.render('config_json_2_pantalla', {
                    title: 'Configuración Json',
                    msm: 'error al conectar con la base mongodb',
                    json: ''
                });
                throw err;

            } else if (result.length > 0) {
                console.log("result");
                console.log("escenas: " + JSON.stringify(result));
                res.render('escenas', {
                    title: 'Escenas Json',
                    json: result,
                    msm: 'OK'
                });

                db.close();

            }
        });
    });
});

app.get('/peliculas/:movieName', (req, res) => {
    const movieName = req.params.movieName;
   const movieFile = './public/peliculas/'+movieName;


  screen(movieFile,res,req);
 });
var i = 0;
app.get('/ips', function(req, res) {
    //console.log("user conectado");
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        var query = {
            name: "config"
        };
        db.collection("Json_Config_2_Pantalla").find(query).toArray(function(err, result) {
            if (err) {
          
                throw err;

            } else if (result.length > 0) {

                res.send(JSON.parse(lzstring.decompressFromBase64(result[0].json)));
                i++;

            }

            db.close();
        });
    });

});

app.get('/escenas/*', function(req, res) {
    var pathname = urlp.parse(req.url).pathname.split('escenas')[1].replace('/', '');
    console.log("Petición para " + pathname + " recibida.");
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var query = {
            ID: pathname
        };
        db.collection("Contenidos").find(query).toArray(function(err, result) {
            if (err) throw err;
            else if (result.length > 0) {
                var query = {
                    name: "config"
                };
                db.collection("Json_Config_2_Pantalla").find(query).toArray(function(err, result2) {
                    if (err) {

                        throw err;
                        console.log("puerto para socket: 9999")

                        res.render('index', {
                            title: '1 Pantalla DEMO',
                            escenas: result[0].json,
                            externalIp: 'localhost',
                            puerto: 9999
                        });
                    } else if (result2.length > 0) {
                var json = (result2[0].json);
                var jsonDecomp = JSON.parse(lzstring.decompressFromBase64(json));
                var ip = jsonDecomp.IP_Servidor_Config.ip;
                var socket = jsonDecomp.IP_Servidor_Config.puertos.socket;
                var ip_chat = jsonDecomp.IP_Servidor_Chat_Broadcast.ip;
                var socket_chat = jsonDecomp.IP_Servidor_Chat_Broadcast.puertos.socket;
                        res.render('index', {
                            title: '1 Pantalla DEMO',
                            escenas: result[0].json,
                            externalIp: ip,
                            puerto: socket,
                            ip_chat: ip_chat,
                            puerto_chat: socket_chat
                        });


                        console.log("puerto para socket:" + JSON.parse(lzstring.decompressFromBase64(result2[0].json)).IP_Servidor_Config.puertos.socket)


                    } else {
                        console.log("puerto para socket: 9999")

                        res.render('index', {
                            title: '1 Pantalla DEMO',
                            escenas: result[0].json,
                            externalIp: 'localhost',
                            puerto: 9999
                        });


                    }
                    console.log(result.length);
                    db.close();
                });


            }
            db.close();
        });
    });

});

app.get('/2v', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            throw err;
            res.render('num_usuarios', {
                title: 'Usuarios Json',
                msm: 'error al conectar con la base mongodb',
                json: ''
            });

        }
        var query = {
            name: "config"
        };
        db.collection("Json_Config_2_Pantalla").find(query).toArray(function(err, result) {
            if (err) {
                res.render('test_secondScreen', {
                    title: '2 Pantalla DEMO',
                    ipS1: '',
                    puertoS1: '',
                    ip_chat: '',
                    puerto_chat: ''
                });
                throw err;

            } else if (result.length > 0) {
                var json = (result[0].json);
                var jsonDecomp = JSON.parse(lzstring.decompressFromBase64(json));
                var ip = jsonDecomp.IP_Servidor_Config.ip;
                var socket = jsonDecomp.IP_Servidor_Config.puertos.socket;
                var ip_chat = jsonDecomp.IP_Servidor_Chat_Broadcast.ip;
                var socket_chat = jsonDecomp.IP_Servidor_Chat_Broadcast.puertos.socket;
                console.log("result: " + json);
                console.log("jsonDecomp: " + JSON.stringify(jsonDecomp));
                console.log("ip: " + JSON.stringify(ip));
                console.log("ip: " + JSON.stringify(socket));

                res.render('test_secondScreen', {
                    title: '2 Pantalla DEMO',
                    ipS1: ip,
                    puertoS1: socket,
                    ip_chat: ip_chat,
                    puerto_chat: socket_chat
                    //ip:externalIp
                });


            } else {

                res.render('test_secondScreen', {
                    title: '2 Pantalla DEMO',
                    ipS1: '',
                    puertoS1: '',
                    ip_chat: '',
                    puerto_chat: ''
                });
            }
            console.log(result.length);
            db.close();
        });
    });
    /*res.render('test_secondScreen', {
        title: '2 Pantalla DEMO'
    });*/
});

app.get('/cerrar', function(req, res) {
    cerrar = true;
    res.clearCookie('remember');
    res.render('login_admin', {
        title: 'Login Admin',
        band: 'true',
        msm: 'iniciar',
        username: ''

    });
    console.log("Ha finalizado la sesion lll");
    //flagSession = false;
});
app.post('/config_json2', function(req, res) {
    var params;
    var usuario_nombre = null;
    nombre = req.body.username;
    console.log("User name = " + nombre);
    //res.send(nombre);
    passwordHash = req.body.password;
    var salt = req.body.salt;
    var bytes = CryptoJS.AES.decrypt(salt.toString(), 'My Secret Passphrase');
    var saltDecAes = bytes.toString(CryptoJS.enc.Utf8);
    console.log('saldDecrypt AES: ', saltDecAes);
    console.log("User name = " + nombre + ", password is " + passwordHash + ", salt is " + saltDecAes);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("users").find({
            username: nombre
        }).toArray(function(err, result) {
            if (err) throw err;
            //resultDB = result;
            
            console.log("result length: "+result.length);
            
            if(result.length > 0){
                /*for (var i = 0; i < result.length; i++) {
                    usuario_nombre = result[i].username;
                    console.log("cont "+i+ ": "+usuario_nombre);
                    break;
                }*/
                resultDB = result[0];
                resultStr = JSON.stringify(resultDB);
                console.log("dd: " + resultStr);
                //console.log("frase2: " + resultStr);
                userDB = JSON.parse(resultStr); //password de la base
                console.log("PassDB: " + userDB.password);

                params = sha512f(userDB.password, saltDecAes);
                console.log("Param HashPassDB: " + params.passwordHash);
                var compare = params.passwordHash.localeCompare(passwordHash);
                var compare_username = nombre.localeCompare(userDB.username);
                if ((compare == 0) && (compare_username==0)) {
                    var id_session = Math.round(Date.now() * Math.random() / 100000);
                    console.log("CORRECTO");
                    flagSession = true;
                    cerrar = false;
                    console.log("id: " + id_session);
                    expired = new Date(Date.now() + (20000));
                    console.log("now: " + new Date(Date.now()) + " expired: " + expired);
                    //res.redirect('/contenido');
                    //req.session.mivariable=id_session;
                    res.cookie('remember', 1, {
                        maxAge: minute
                    });
                        MongoClient.connect(url, function(err, db) {
                        if (err) throw err;
                        db.collection("Contenidos").find({}).toArray(function(err, result) {
                            if (err) throw err;
                            res.render('contenidos_subidos', {
                                title: 'Escenas Guardadas',
                                resultado: result,
                                firebaseConfig: firebaseConfig
                            });
                            //console.log("escenas: " + JSON.stringify(result));
                            db.close();
                        });

                    });

                }
                else {
                    console.log("inCORRECTO");
                    //res.op_second_screen    ("error: "+nombre);
                    res.render('login_admin', {
                        msm: 'error',
                        band: 'true',
                        username: nombre
                    });

                }



            }
            //console.log("result: "+JSON.stringify(result[0].username));
             else {
                console.log("inCORRECTO");
                //res.op_second_screen    ("error: "+nombre);
                res.render('login_admin', {
                    msm: 'error',
                    band: 'true',
                    username: nombre
                });

            }

            db.close();
        });

    });

});



app.all('*', verificarSesion2);

app.post('/cambiar_credenciales', function(req, res) {
    var params;
    var usuario_nombre = null;
    nombre = req.body.username;
    console.log("User name = " + nombre);
    //res.send(nombre);
    passwordHash = req.body.passwordA;
    var passwordNuevoMD5 = req.body.passwordN;
    var salt = req.body.salt;
    var bytes = CryptoJS.AES.decrypt(salt.toString(), 'My Secret Passphrase');
    var saltDecAes = bytes.toString(CryptoJS.enc.Utf8);
    console.log('saldDecrypt AES: ', saltDecAes);
    console.log("User name = " + nombre + ", password is " + passwordHash + ", salt is " + saltDecAes);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("users").find({
            username: nombre
        }).toArray(function(err, result) {
            if (err) throw err;
            
            console.log("result length: "+result.length);
            if(result.length > 0){
                resultDB = result[0];
                resultStr = JSON.stringify(resultDB);
                console.log("dd: " + resultStr);
                userDB = JSON.parse(resultStr); //password de la base
                console.log("PassDB: " + userDB.password);

                params = sha512f(userDB.password, saltDecAes);
                console.log("Param HashPassDB: " + params.passwordHash);
                var compare = params.passwordHash.localeCompare(passwordHash);
                var compare_username = nombre.localeCompare(userDB.username);
                if ((compare == 0) && (compare_username==0)) {
                    console.log("CORRECTO");
                    var query2 = {
                        username: nombre
                    };
                    var newvalues = { username: nombre, password: passwordNuevoMD5};

                    db.collection("users").update(query2, newvalues, function(err, result3) {
                        if (err) {
                            console.log("NOOO se guardo la nueva contrasenia");

                        } else {
                            console.log("Se guardoo la nueva contrasenia: "+ passwordNuevoMD5);
                            res.render('login_admin', {
                                title: 'Login Admin',
                                band: 'false',
                                msm: 'OK',
                                username: ''

                            });

                        }
                        
                    });
                        

                }
                else {
                    console.log("inCORRECTO");
                    //res.op_second_screen    ("error: "+nombre);
                    res.render('login_admin', {
                        msm: 'error',
                        band: 'true',
                        username: nombre
                    });

                }



            }
            //console.log("result: "+JSON.stringify(result[0].username));
             else {
                console.log("inCORRECTO");
                //res.op_second_screen    ("error: "+nombre);
                res.render('login_admin', {
                    msm: 'error',
                    band: 'true',
                    username: nombre
                });

            }

            db.close();
        });

    });

});

app.get('/total_usuarios', function(req, res) {
      //console.log("Session var INICIO: " + req.cookies.remember);
    renuevaTime(req, res);
    MongoClient.connect(url, function(err, db) {
        if (err) {
            throw err;
            res.render('num_usuarios', {
                title: 'Usuarios Json',
                msm: 'error al conectar con la base mongodb',
                json: ''
            });

        }
        var query = {
            name: "config"
        };
        db.collection("Json_Config_2_Pantalla").find(query).toArray(function(err, result) {
            if (err) {
                res.render('num_usuarios', {
                    title: 'Usuarios',
                    msm: 'error al conectar con la base mongodb',
                    json: '',
                    ip: ''
                });
                throw err;

            } else if (result.length > 0) {
                var json = (result[0].json);
                var jsonDecomp = JSON.parse(lzstring.decompressFromBase64(json));
                var ip = jsonDecomp.IP_Servidor_Config.ip;
                var socket = jsonDecomp.IP_Servidor_Config.puertos.socket;
                //console.log("result: " + json);
                //console.log("jsonDecomp: " + JSON.stringify(jsonDecomp));
                //console.log("ip: " + JSON.stringify(ip));
                //console.log("ip: " + JSON.stringify(socket));

                res.render('num_usuarios', {
                    title: 'Usuarios',
                    ip: ip,
                    puerto: socket
                    //ip:externalIp
                });


            } else {

                res.render('num_usuarios', {
                    title: 'Usuarios',
                    json: '',
                    msm: 'OK',
                    ip: externalIp
                });


            }
            console.log(result.length);
            db.close();
        });
    });
    
});

app.get('/usuarios_sala', function(req, res) {
    renuevaTime(req, res);
    MongoClient.connect(url, function(err, db) {
        if (err) {
            throw err;
            res.render('por_contenido', {
                title: 'Usuarios total',
                msm: 'error al conectar con la base mongodb',
                json: ''
            });

        }
        var query = {
            name: "config"
        };
        db.collection("Json_Config_2_Pantalla").find(query).toArray(function(err, result) {
            if (err) {
                res.render('por_contenido', {
                    title: 'Usuarios total',
                    msm: 'error al conectar con la base mongodb',
                    json: '',
                    ip: ''
                });
                throw err;

            } else if (result.length > 0) {
                var json = (result[0].json);
                var jsonDecomp = JSON.parse(lzstring.decompressFromBase64(json));
                var ip = jsonDecomp.IP_Servidor_Config.ip;
                var socket = jsonDecomp.IP_Servidor_Config.puertos.socket;

                res.render('por_contenido', {
                    title: 'Usuarios total',
                    ip: ip,
                    puerto: socket
                   
                });


            } else {

                res.render('por_contenido', {
                    title: 'Usuarios total',
                    json: '',
                    msm: 'OK',
                    ip: externalIp
                });


            }
            //console.log(result.length);
            db.close();
        });
    });
    
});

app.post('/admin_cont_sub', function(req, res) {
    var actividad = req.body.actividad;
    var ID = req.body.ID;
    console.log("ID: " + ID);
    if ('delete'.localeCompare(actividad) == 0) {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var path = {
                ID: ID
            };
            db.collection("Contenidos").deleteOne(path, function(err, obj) {
                if (err) throw err;
                else {
                    MongoClient.connect(url, function(err, db) {
                        if (err) throw err;
                        db.collection("Contenidos").find({}).toArray(function(err, result) {
                            if (err) throw err;
                            res.render('contenidos_subidos', {
                                title: 'Escenas Guardadas',
                                resultado: result,
                    firebaseConfig: firebaseConfig
                            });
                            db.close();
                        });

                    });
                }
                console.log("1 document deleted");
            });
        });

    } else if ('edit'.localeCompare(actividad) == 0) {

        MongoClient.connect(url, function(err, db) {
            if (err) {
                throw err;
                res.render('config_json', {
                    title: 'Configuración Json',
                    msm: 'error al conectar con la bse mongodb',
                    json: ''
                });

            }
            var query = {
                name: "config"
            };
            db.collection("Json_Config").find(query).toArray(function(err, result) {
                if (err) {
                    res.render('subir_cont', {
                        title: 'Subir Contenido',
                        msm: 'error al conectar con la bse mongodb',
                        json: '',
                        escenas: ''
                    });
                    throw err;

                } else if (result.length > 0) {
                    var path = {
                        ID: ID
                    };
                    db.collection("Contenidos").find(path).toArray(function(err, result2) {
                        if (err) throw err;
                        else if (result2.length > 0) {

                            res.render('subir_cont', {
                                title: 'Subir Contenido',
                                json: result[0].json,
                                firebaseConfig: firebaseConfig,
                                escenas: result2[0].json
                            });
                        }
                        db.close();
                    });

                } else {
                    res.render('subir_cont', {
                        title: 'Subir Contenido',
                        json: '',
                        escenas: ''
                    });

                }
                console.log(result.length);
                db.close();
            });
        });

    }


});
var path = {
    ID: null
};
MongoClient.connect(url, function(err, db) {
    db.collection("Contenidos").deleteOne(path, function(err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
    });
});
app.post('/jsonConf2Pantalla', function(req, res) {
    var json_confi = req.body.schema2;
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var myobj = {
            name: "config",
            json: json_confi
        };
        var query = {
            name: "config"
        };
        db.collection("Json_Config_2_Pantalla").find(query).toArray(function(err, result) {
            if (err) {
                throw err;
                res.render('config_json_2_pantalla', {
                    title: 'Configuración Json',
                    json: '',
                    msm: 'error'
                });
            } else if (result.length > 0) {
                var newvalues = {
                    $set: {
                        json: json_confi
                    }
                };
                db.collection("Json_Config_2_Pantalla").update(query, newvalues, function(err, result) {
                    if (err) {
                        throw err
                        res.render('config_json_2_pantalla', {
                            title: 'Configuración Json',
                            json: '',
                            msm: 'error'
                        })
                    } else {
                        console.log(result.result.nModified + " record updated");
                        res.render('vista_json_2_pantalla', {
                            title: 'Vista Json',
                            json: json_confi,
                            msm: 'OK'
                        });
                    }
                });
            } else {
                db.collection("Json_Config_2_Pantalla").insertOne(myobj, function(err, result) {
                    if (err) {
                        throw err
                        res.render('config_json_2_pantalla', {
                            title: 'Configuración Json',
                            json: '',
                            msm: 'error'
                        })
                    } else {
                        console.log("1 record inserted");
                        res.render('vista_json_2_pantalla', {
                            title: 'Vista Json',
                            json: json_confi,
                            msm: 'OK'
                        });
                    }
                });
            }
            console.log(result.length);
            db.close();
        });

    });

    // res.render('page_contenido', { title: 'Subir Contenido' });
    //res.render('index', { title: '1 Pantalla DEMO' });
});
app.post('/jsonConf', function(req, res) {
    var json_confi = req.body.schema2;
    console.log("Table json_contenidos_subidos!" + json_confi);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var myobj = {
            name: "config",
            json: json_confi
        };
        var query = {
            name: "config"
        };
        db.collection("Json_Config").find(query).toArray(function(err, result) {
            if (err) {
                throw err;
                res.render('config_json', {
                    title: 'Configuración Json',
                    json: '',
                    msm: 'error'
                });
            } else if (result.length > 0) {
                var newvalues = {
                    $set: {
                        json: json_confi
                    }
                };
                db.collection("Json_Config").update(query, newvalues, function(err, result) {
                    if (err) {
                        throw err
                        res.render('config_json', {
                            title: 'Configuración Json',
                            json: '',
                            msm: 'error'
                        })
                    } else {
                        console.log(result.result.nModified + " record updated");
                        res.render('vista_json', {
                            title: 'Vista Json',
                            json: json_confi,
                            msm: 'OK'
                        });
                    }
                });
            } else {
                db.collection("Json_Config").insertOne(myobj, function(err, result) {
                    if (err) {
                        throw err
                        res.render('config_json', {
                            title: 'Configuración Json',
                            json: '',
                            msm: 'error'
                        })
                    } else {
                        console.log("1 record inserted");
                        res.render('vista_json', {
                            title: 'Vista Json',
                            json: json_confi,
                            msm: 'OK'
                        });
                    }
                });
            }
            console.log(result.length);
            db.close();
        });

    });

    // res.render('page_contenido', { title: 'Subir Contenido' });
    //res.render('index', { title: '1 Pantalla DEMO' });
});


app.get('/vista_json_2_pantalla', function(req, res) {
    renuevaTime(req, res);

    MongoClient.connect(url, function(err, db) {
        if (err) {
            throw err;
            res.render('vista_json_2_pantalla', {
                title: 'Vista Json',
                json: '',
                msm: 'error'
            });

        }
        var query = {
            name: "config"
        };
        db.collection("Json_Config_2_Pantalla").find(query).toArray(function(err, result) {
            if (err) {
                res.render('vista_json', {
                    title: 'Vista Json',
                    json: '',
                    msm: 'error'
                });
                throw err;

            } else if (result.length > 0) {
                console.log(result);
                res.render('vista_json_2_pantalla', {
                    title: 'Vista Json',
                    json: result[0].json,
                    msm: 'view'
                });
            } else {
                res.render('vista_json_2_pantalla', {
                    title: 'Vista Json',
                    json: '',
                    msm: 'view'
                });

            }
            console.log(result.length);
            db.close();
        });
    });
});
app.get('/vista_json', function(req, res) {
    renuevaTime(req, res);
    MongoClient.connect(url, function(err, db) {
        if (err) {
            throw err;
            res.render('vista_json', {
                title: 'Vista Json',
                json: '',
                msm: 'error'
            });

        }
        var query = {
            name: "config"
        };
        db.collection("Json_Config").find(query).toArray(function(err, result) {
            if (err) {
                res.render('vista_json', {
                    title: 'Vista Json',
                    json: '',
                    msm: 'error'
                });
                throw err;

            } else if (result.length > 0) {
                console.log(result);
                res.render('vista_json', {
                    title: 'Vista Json',
                    json: result[0].json,
                    msm: 'view'
                });
            } else {
                res.render('vista_json', {
                    title: 'Vista Json',
                    json: '',
                    msm: 'view'
                });

            }
            console.log(result.length);
            db.close();
        });
    });

    //}

});

function verificarSesion2(req, res, next) {
    console.log("Expired: "+expired);
    console.log("ENTER");
    //res.clearCookie('remember');
    console.log("Session var: " + req.cookies.remember);
    if (expired == null) {
        console.log("ENTER expire null");
        res.render('login_admin', {
            title: 'Login Admin',
            band: 'true',
            msm: 'iniciar',
            username: ''

        });

    } else {
        if (typeof(req.cookies.remember) == 'undefined') {
            if (cerrar) {
                console.log("ENTER cerrar");
                res.render('login_admin', {
                    title: 'Login Admin',
                    band: 'true',
                    msm: 'iniciar',
                    username: ''

                });

            } else {
                console.log("ENTER undefined");
                res.clearCookie('remember');
                console.log("Session var: " + req.cookies.remember);
                res.render('login_admin', {
                    title: 'Login Admin',
                    band: 'true',
                    msm: 'expired',
                    username: ''

                });

                console.log("Ha finalizado la sesion");

            }

        } else {
            next();
            console.log("ENTER sesion valida");

        }

    }


}

app.get('/contenido', function(req, res, next) {
    renuevaTime(req, res);
       MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("Contenidos").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.render('contenidos_subidos', {
                title: 'Escenas Guardadas',
                resultado: result,
                firebaseConfig: firebaseConfig
            });
            //console.log("escenas: " + JSON.stringify(result));
            db.close();
        });

    });



});


app.get('/contenidos_subidos', function(req, res, next) {
    renuevaTime(req, res);

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("Contenidos").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.render('contenidos_subidos', {
                title: 'Escenas Guardadas',
                resultado: result,
                firebaseConfig: firebaseConfig
            });
            //console.log("escenas: " + JSON.stringify(result));
            db.close();
        });

    });



});


app.get('/subir_cont', function(req, res) {
    renuevaTime(req, res);
    MongoClient.connect(url, function(err, db) {
        if (err) {
            throw err;
            res.render('config_json', {
                title: 'Configuración Json',
                msm: 'error al conectar con la bse mongodb',
                json: ''
            });

        }
        var query = {
            name: "config"
        };
        db.collection("Json_Config").find(query).toArray(function(err, result) {
            if (err) {
                res.render('subir_cont', {
                    title: 'Subir Contenido',
                    msm: 'error al conectar con la bse mongodb',
                    json: '',
                    escenas: ''
                });
                throw err;

            } else if (result.length > 0) {
                res.render('subir_cont', {
                    title: 'Subir Contenido',
                    json: result[0].json,
                    firebaseConfig: firebaseConfig,
                    escenas: ''
                });

                db.close();


            } else {
                res.render('subir_cont', {
                    title: 'Subir Contenido',
                    json: '',
                    escenas: ''
                });

            }
            console.log(result.length);
            db.close();
        });
    });




});

app.get('/config_json_2_pantalla', function(req, res) {
    renuevaTime(req, res);
    ipdinamicas();
    MongoClient.connect(url, function(err, db) {
        if (err) {
            throw err;
            res.render('config_json_2_pantalla', {
                title: 'Configuración Json',
                msm: 'error al conectar con la base mongodb',
                json: ''
            });

        }
        var query = {
            name: "config"
        };
        db.collection("Json_Config_2_Pantalla").find(query).toArray(function(err, result) {
            if (err) {
                res.render('config_json_2_pantalla', {
                    title: 'Configuración Json',
                    msm: 'error al conectar con la base mongodb',
                    json: ''
                });
                throw err;

            } else if (result.length > 0) {

                console.log(JSON.stringify(result[0].json))
                res.render('config_json_2_pantalla', {
                    title: 'Configuración Json',
                    json: result[0].json,
                    msm: 'OK'
                });


            } else {
                    res.render('config_json_2_pantalla', {
                        title: 'Configuración Json',
                        json: '',
                        msm: 'OK'
                    });

          

            }
            console.log(result.length);
            db.close();
        });
    });
});
app.get('/config_json', function(req, res) {
    renuevaTime(req, res);
    MongoClient.connect(url, function(err, db) {
        if (err) {
            throw err;
            res.render('config_json', {
                title: 'Configuración Json',
                msm: 'error al conectar con la base mongodb',
                json: ''
            });

        }
        var query = {
            name: "config"
        };
        db.collection("Json_Config").find(query).toArray(function(err, result) {
            if (err) {
                res.render('config_json', {
                    title: 'Configuración Json',
                    msm: 'error al conectar con la base mongodb',
                    json: ''
                });
                throw err;

            } else if (result.length > 0) {
                console.log(result);
                res.render('config_json', {
                    title: 'Configuración Json',
                    json: result[0].json,
                    msm: 'OK'
                });
            } else {
                res.render('config_json', {
                    title: 'Configuración Json',
                    json: '',
                    msm: 'OK'
                });

            }
            console.log(result.length);
            db.close();
        });
    });
    //}

});

io.set('log level', 1);

// Escuchamos conexiones entrantes
io.sockets.on('connection', function(socket) {
    connections++;
    console.log('connected', connections);
    io.sockets.emit('connections', {
        connections: connections
    });

    socket.on('cargar_sincronizados', function(){
        console.log("Enter evento num_usuarios_conectados");
        var rooms = io.sockets.adapter.rooms;
        console.log("keys: "+hash_cont_conectados.keys());
        var keys = hash_cont_conectados.keys();
        for (var i=0; i< hash_cont_conectados.keys().length; i++) {
            console.log("Enter evento num_usuarios_conectados");
            var sala = keys[i];
            console.log("salaID: "+sala);
            try{
                var cont = io.sockets.adapter.rooms[sala].length-1;
                console.log("disconnect "+sala+"-> "+(cont));
                socket.emit('num_usuarios_conectados', {
                    connections: cont,
                    sala:  sala
                });
                console.log("1 broadcast");
                
            }
            catch(err){
                console.log("Conectados: 0");
                break;
            }
                
               
      
        } 
        
      
        

    });

    socket.on('opcion_2c', function(data) {
        console.log('Sala:', data.sala);
        console.log('Sala:', data.option);
        io.to(data.sala).emit('opcion_1c', data.option);
    });
    socket.on('opciones', function(data) {
        // transmitimos el movimiento a todos los clienntes conectados
        console.log('Opciones:', data.opciones);
        console.log('Pregunta: ', data.pregunta);
        if(data.pregunta==null || data.pregunta==""){
            data.pregunta="¿Qué desición debera tomar?"
        }
        //io.to(data.sala).emit('op_second_screen', data.opciones);
        io.to(data.sala).emit('op_second_screen', {
                                                    opciones : data.opciones,
                                                    pregunta: data.pregunta});
    });
    socket.on('mensaje', function(data) {
        // transmitimos el movimiento a todos los clienntes conectados
        io.sockets.emit('mensaje2', {
            data: data
        });
    });
    socket.on('image', function(data) {
        // transmitimos el movimiento a todos los clienntes conectados
        console.log("IMAGEN: "+data.url);
        io.to(data.sala).emit('imagen', data.url
        );
    });
    socket.on('mensaje', function(data) {
        // transmitimos el movimiento a todos los clienntes conectados
        io.sockets.emit('mensaje2', {
            data: data
        });
    });
    socket.on('avisoGanador', function(data) {
        // transmitimos el movimiento a todos los clienntes conectados
        console.log("ecena ganador:"+data.win)
            io.to(data.sala).emit('play',{escenaCurrent:data.win});
    });
    socket.on('crearSala', function(data) {
        // transmitimos el movimiento a todos los clienftes conectados
        console.log('Sala:-------------------', data.sala.toString());
       // console.log('Sala:', data);
        socket.join(data.sala);
        if (data.admin != null && data.admin) {
            console.log('entro if');
            map_ids_contenido_sala.set(data.sala.toString(), data.ctm);
            var contm = map_ids_contenido_sala.get(data.sala.toString())
            console.log(contm)
        } else {
            if(map_ids_contenido_sala.get(data.sala.toString())==null || map_ids_contenido_sala.get(data.sala.toString()).toString().trim() == '')
            {
             socket.emit('confirmacion_join', {
                            msm: 'El codigo escaneado no pertenece a nuestra apliación',
                            contenido_transmedia: 'nada'
                        });
            }
            else{
                if(hash_cont_conectados.get(data.sala)){
                            
                            var cont = (hash_cont_conectados.get(data.sala)) + 1;
                            hash_cont_conectados.set(data.sala, cont);  
                            console.log("Get conectados: "+hash_cont_conectados.get(data.sala));  

                }
                else{
                    console.log("cont 1 -> sala nueva");
                    hash_cont_conectados.set(data.sala, 1);
                }
                socket.broadcast.to(data.sala).emit('usuarios_sincronizados', {
                        connections: (io.sockets.adapter.rooms[data.sala].length)-1
                });
                socket.broadcast.emit('num_usuarios_conectados', {
                        connections: (io.sockets.adapter.rooms[data.sala].length)-1,
                        sala: data.sala
                });

                console.log('entro else:', data);
                var msm = "te has conectado a la sala" + data.sala;
                var contm = map_ids_contenido_sala.get(data.sala)
                console.log("msm: "+msm);
                console.log("contm: "+contm);
                socket.emit('confirmacion_join', {
                    msm: msm,
                    contenido_transmedia: contm
                });

            }
        
        }

    });


    socket.on('disconnect', function() {
        connections--;
        console.log('connected', connections);
        var rooms = io.sockets.adapter.rooms;
        console.log("keys: "+hash_cont_conectados.keys());
        var keys = hash_cont_conectados.keys();
        for (var i=0; i< hash_cont_conectados.keys().length; i++) {
            
            var sala = keys[i];
            console.log("Meth Disconnect salaID: "+sala);
            try{
                console.log(rooms);
                          console.log(io.sockets.adapter.rooms[sala.toString()]);
                var cont = io.sockets.adapter.rooms[sala.toString()].length-1;
                console.log("disconnect "+sala+"-> "+(cont));
                socket.broadcast.emit('num_usuarios_conectados', {
                    connections: cont,
                    sala:  sala
                });
                console.log("1 broadcast");
                socket.broadcast.to(sala).emit('usuarios_sincronizados', {
                        connections: (io.sockets.adapter.rooms[sala.toString()].length)-1
                 });
                
                console.log("2 broadcast" +cont);
                if(cont==0 ){
                    console.log(hash_cont_conectados.keys())
                            console.log(hash_cont_conectados)
                hash_cont_conectados.remove(sala.toString())
                 console.log(hash_cont_conectados.keys())
                }
            }
            catch(err){
                console.log("Error sala "+ sala+" conectados: 0");
                break;
            }
            
           
          
        }

        

    
        socket.broadcast.emit('connections', {
            connections: connections
        });
    });

    


});

app.post('/upload', function(req, res) {
    //El modulo 'fs' (File System) que provee Nodejs nos permite manejar los archivos
    var json_con = req.body.output2;
    var ID = req.body.IDescena;
    console.log(ID)
    console.log(json_con)
    json_con = lzstring.compressToBase64(json_con);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var myobj = {
            ID: ID,
            json: json_con
        };
        var query = {
            ID: ID
        };
        db.collection("Contenidos").find(query).toArray(function(err, result) {
            if (err) {
                throw err;

            } else if (result.length > 0) {
                var newvalues = {
                    $set: {
                        json: json_con
                    }
                };
                db.collection("Contenidos").update(query, newvalues, function(err, result) {
                    if (err) {
                        throw err

                    } else {
                        MongoClient.connect(url, function(err, db) {
                            if (err) throw err;
                            db.collection("Contenidos").find({}).toArray(function(err, result) {
                                if (err) throw err;
                                res.render('contenidos_subidos', {
                                    title: 'Escenas Guardadas',
                                    resultado: result,
                    firebaseConfig: firebaseConfig
                                });
                                console.log("result: " + JSON.stringify(result));
                                db.close();
                            });

                        });
                    }
                });
            } else {
                db.collection("Contenidos").insertOne(myobj, function(err, result) {
                    if (err) {
                        throw err

                    } else {
                        MongoClient.connect(url, function(err, db) {
                            if (err) throw err;
                            db.collection("Contenidos").find({}).toArray(function(err, result) {
                                if (err) throw err;
                                res.render('contenidos_subidos', {
                                    title: 'Escenas Guardadas',
                                    resultado: result,
                    firebaseConfig: firebaseConfig
                                });
                                db.close();
                            });

                        });
                    }
                });
            }
            console.log(result.length);
            db.close();
        });

    });

})

var genRandomString = function(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length); /** return required number of characters */
};

var sha512f = function(password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    console.log("sha512f salt: " + salt);
    console.log("sha512f pass: " + password);
    hash.update(password);
    var value = hash.digest('hex');
    console.log("sha512f value: " + value);
    return {
        salt: salt,
        passwordHash: value
    };
};

function saltHashPassword(userpassword) {
    salt = genRandomString(16); /** Gives us salt of length 16 */
    passwordData = sha512f(userpassword, salt);
    console.log('UserPassword = ' + userpassword);
    console.log('Passwordhash = ' + passwordData.passwordHash);
    console.log('nSalt = ' + passwordData.salt);
}
function ipdinamicas() {
MongoClient.connect(url, function(err, db) {
    if (err) {
        throw err;
    }
    var query = {
        name: "config"
    };
    db.collection("Json_Config_2_Pantalla").find(query).toArray(function(err, result) {
        if (err) {

        } else if (result.length > 0) {

            var url2 = JSON.parse(lzstring.decompressFromBase64(result[0].json)).IP_Servidor_Chat_Broadcast.url
   getExternalIp(function(externalIp) {
                    console.log(externalIp)
                    if(externalIp.localeCompare("localhost")!=0)
                    {
            request.get({
                url: url2 + '/ips'
            }, function(err, response) {
                var ip3m = total = response.body;
             
                    MongoClient.connect(url, function(err, db) {
                        if (err) {
                            throw err;
                        }
                        console.log(externalIp)
                        var query = {
                            name: "config"
                        };
                        db.collection("Json_Config_2_Pantalla").find(query).toArray(function(err, result2) {
                            if (err) {

                            } else if (result2.length > 0) {

                                var temp = JSON.parse(lzstring.decompressFromBase64(result2[0].json))
                                temp.IP_Servidor_Config.ip = externalIp
                                temp.IP_Servidor_Chat_Broadcast.ip = ip3m
                                var query2 = {
                                    _id: result2[0]._id
                                };
                                var newvalues = {
                                    $set: {
                                        json: lzstring.compressToBase64(JSON.stringify(temp))
                                    }
                                };

                                db.collection("Json_Config_2_Pantalla").update(query2, newvalues, function(err, result3) {
                                    if (err) {

                                    } else {

                                    }
                                });
                            } else {}
                            db.close();
                        });
                    });
                    
                });
                }
            });
        } else {}
        db.close();
    });
});


}



app.get('/cerrar2', function(req, res) {
    delete req.session.mivariable;
    res.render('login_admin', {
        title: 'Login Admin',
        band: 'false',
        msm: 'OK',
        username: ''

    });
    console.log("Ha finalizado la sesion");
    flagSession = false;
});


app.get('*', function(req, res) {
    if (expired == null) {
        res.render('login_admin', {
            title: 'Login Admin',
            band: 'false',
            msm: 'OK',
            username: ''

        });
    } else {
     MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("Contenidos").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.render('contenidos_subidos', {
                title: 'Escenas Guardadas',
                resultado: result,
                firebaseConfig: firebaseConfig
            });
            //console.log("escenas: " + JSON.stringify(result));
            db.close();
        });

    });
    }

});


function stringGen(len) {
    var text = " ";

    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < len; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
}

function renuevaTime(req, res) {
   //console.log("Session var INICIO: " + req.cookies.remember);
    now = new Date(Date.now());
    console.log("Now: " + now);
    expired = new Date(Date.now() + minute);
    console.log("Expired: " + expired);
    res.cookie('remember', Number(req.cookies.remember) + 1, {
        maxAge: minute
    });
}
var METADATA_NETWORK_INTERFACE_URL = 'http://metadata/computeMetadata/v1/' +
    '/instance/network-interfaces/0/access-configs/0/external-ip';



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
server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});