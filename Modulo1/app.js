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
var cons= require('consolidate');
var path = require("path");
var request = require('request');
const storage = require('./storage');
const lzstring = require('./public/js/LZString');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://root:1234@104.155.160.16:27017/admin";
//var url = "mongodb://localhost:27017/data";
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser'); 
var urlp = require("url");
var connections = 0;
var salt= ''; 
var passwordData = '';
var passwordHash = '';
var nombre = '';
var passAdminHash = ''; 
var resultDB =   '';
var resultStr = '';
var finalJson = '';
var finalPassDB = '';
var app = express();
var server = http.createServer(app);
var app_chat = require('express')();
var server1 = require('http').Server(app_chat);
var io = require('socket.io')(server1);
var map_ids_idsonido = new HashMap();
var flagSession = false;
var cerrar = false;
var now = null;
var expired = null;

app.engine('.html',cons.jade);
app.set('view engine','html');
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

const minute = 1800 * 1000;


//Express 4
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

// Set Content-Type for all responses for these routes
app.use((req, res, next) => {
  res.set('Content-Type', 'text/html');
  next();
});
// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
    MongoClient.connect(url, function(err, db) {
        if (err) {
            throw err;
            server1.listen(65080);
                console.log("puerto para socket: 3000")

        }
        var query = {
            name: "config"
        };
        db.collection("Json_Config_2_Pantalla").find(query).toArray(function(err, result) {
            if (err) {
           
                throw err;
                server1.listen(65080);
                console.log("puerto para socket: 3000")
            } else if (result.length > 0) {
                 server1.listen(JSON.parse(lzstring.decompressFromBase64(result[0].json)).IP_Servidor_Config.puertos.socket)
            console.log("puerto para socket:"+JSON.parse(lzstring.decompressFromBase64(result[0].json)).IP_Servidor_Config.puertos.socket)


            } else {
               server1.listen(65080);
             console.log("puerto para socket: 3000")

            }
            console.log(result.length);
            db.close();
        });
    });
app.get('/login', function(req, res){
  //res.render('login_admin', { title: 'Login Admin' });
  res.render('login_admin', {
    title: 'Login Admin',
    band: 'false',
    msm : 'OK',
    username: ''

            });
});

app.get('/', function(req, res){
  res.render('login_admin', {
    title: 'Login Admin',
    band: 'false',
    msm : 'OK',
    username: ''

            });
});

app.get('/escenas', function(req, res){
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
            console.log("escenas: "+JSON.stringify(result));
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


app.get('/inicio', function(req, res){
  res.render('login_admin', {
    title: 'Login Admin',
    band: 'false',
    msm : 'OK',
    username: ''

            });
});

var schema = '[' + 
    '{ "server1": [' +
                '{"ip":"localhost",' +
                '"port":"3331"' +
    '}]},' +
    '{"server2":[{' +
                '"ip":"localhost",' +
                '"port":"3000"' +
    '}]},' +
    '{"server3":[{'+
                '"ip":"localhost",' +
                '"port":"8088"' +
    '}]}]';

var ipsJson = {ips:[ 
    {server1:[
                {ip: 'localhost',
                 port: 3331
                
                }
    ]}, 
    {server2:[
                {ip:'localhost',
                 port: 3000
    
                }
    ]},
    {server3:[
                {ip:'localhost',
                 port:8088
                }
    ]}]
}
var i=0;
app.get('/ips', function(req, res){
  res.send(ipsJson);
  i++;
  console.log("enviado :"+i);
});

app.get('/escenas/*', function(req, res) {
    var pathname = urlp.parse(req.url).pathname.split('escenas')[1].replace('/','');
        console.log("Petición para " + pathname + " recibida.");
    MongoClient.connect(url, function(err, db) {
  if (err) throw err;
   var query = { title:pathname};
  db.collection("Contenidos").find(query).toArray(function(err, result) {
    if (err) throw err;
     else if (result.length > 0) {
      getExternalIp(function (externalIp) {
             res.render('index', {
                title: '1 Pantalla DEMO',
                escenas:result[0].json,
                externalIp: externalIp
            });
      });
   
         }
    db.close();
  });
}); 
   
});

app.get('/2v', function(req, res) {
    res.render('test_secondScreen', {
        title: '2 Pantalla DEMO'
    });
});

app.get('/cerrar', function (req,res) {
        cerrar = true;
        res.clearCookie('remember');
        res.render('login_admin', {
            title: 'Login Admin',
            band: 'true',
            msm : 'iniciar',
            username: ''

                    });
        console.log("Ha finalizado la sesion lll");
        //flagSession = false;
});

app.post('/config_json2',function(req,res){
  var params;
  nombre=req.body.username;
  console.log("User name = "+nombre);
  //res.send(nombre);
  passwordHash=req.body.password;
  var salt=req.body.salt;
  var bytes  = CryptoJS.AES.decrypt( salt.toString(), 'My Secret Passphrase');
  var saltDecAes = bytes.toString(CryptoJS.enc.Utf8);
  console.log('saldDecrypt AES: ', saltDecAes);
  console.log("User name = "+nombre+", password is "+passwordHash+", salt is "+saltDecAes);
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
       db.collection("users").find({username: nombre}).toArray(function(err, result) {
        if (err) throw err;
        //resultDB = result;
        resultDB = result[1]; 
        resultStr = JSON.stringify(resultDB)
        console.log("dd: " +resultStr);
        resultStr = resultStr.replace('[','')
        resultStr = resultStr.replace(']','')
        console.log("frase2: "+ resultStr);
        finalPassDB = JSON.parse(resultStr); //password de la base
        console.log("PassDB: "+ finalPassDB.password);

        params = sha512f(finalPassDB.password, saltDecAes); 
        console.log("Param HashPassDB: "+ params.passwordHash);
        var compare = params.passwordHash.localeCompare(passwordHash);
        if(compare == 0){
            var id_session = Math.round(Date.now()*Math.random()/100000);
            console.log("CORRECTO");
            flagSession = true;
            cerrar = false;
            console.log("id: "+id_session);
            expired = new Date(Date.now() + (20000));
            console.log("now: "+new Date(Date.now())+" expired: "+expired);
            //res.redirect('/contenido');
            //req.session.mivariable=id_session;
            res.cookie('remember', 1, { maxAge: minute });
            res.render('page_contenido',{Titulo:'contenido', band: 'true', Nombre:id_session, Expire:expired});

        }
        else{
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

app.post('/admin_cont_sub', function(req, res) {
    var actividad = req.body.actividad;
    var title = req.body.title;
 if('delete'.localeCompare(actividad)==0){
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
   var path = { title:title};
  db.collection("Contenidos").deleteOne(path, function(err, obj) {
    if (err) throw err;
    else{
        MongoClient.connect(url, function(err, db) {
                              if (err) throw err;
                              db.collection("Contenidos").find({}).toArray(function(err, result) {
                                if (err) throw err;
                                 res.render('contenidos_subidos', {
                                    title: 'Escenas Guardadas',
                                    resultado: result
                                });
                                db.close();
                              });
                               
                            });
    }
    console.log("1 document deleted");
  });
});

    }
     else if('edit'.localeCompare(actividad)==0){

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
                  escenas:''
                });
                throw err;

            } else if (result.length > 0) {
                var path = { title:title};
                  db.collection("Contenidos").find(path).toArray(function(err, result2) {
                    if (err) throw err;
                     else if (result2.length > 0) {
               
                        res.render('subir_cont', {
                            title: 'Subir Contenido',
                            json: result[0].json,
                            escenas:result2[0].json
                        });
                         }
                    db.close();
                  });

            } else {
                res.render('subir_cont', {
                    title: 'Subir Contenido',
                    json: '',
                  escenas:'' 
                });

            }
            console.log(result.length);
            db.close();
        });
    });

    }
    
   
});
   var path = { json:null};
 /*  MongoClient.connect(url, function(err, db) {
  db.collection("Contenidos").deleteOne(path, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  });
  });*/
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
    console.log("ENTER bien hp");
    now = new Date(Date.now());
    console.log("Now: "+now);
    //console.log("Expired: "+expired);
    
    expired = new Date(Date.now() + minute);
    console.log("Expired: "+expired);              
    res.cookie('remember', Number(req.cookies.remember) + 1, { maxAge: minute }); 
    
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
    console.log("Session var INICIO: "+req.cookies.remember);
    now = new Date(Date.now());
    console.log("Now: "+now);
    /*if(now >= expired){
        verificarSesion(req, res, expired);
    }
    else{*/
    expired = new Date(Date.now() + minute);
    console.log("Expired: "+expired);              
    res.cookie('remember', Number(req.cookies.remember) + 1, { maxAge: expired });  
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

function verificarSesion2(req, res, next){
    //console.log("Expired: "+expired);
    console.log("ENTER");    
    //res.clearCookie('remember');
    console.log("Session var: "+req.cookies.remember);
    if(expired == null){
        console.log("ENTER expire null"); 
        res.render('login_admin', {
        title: 'Login Admin',
        band: 'true',
        msm : 'iniciar',
        username: ''

                });
    
    }
    else{
        if (typeof(req.cookies.remember) == 'undefined') {
            if(cerrar){
                console.log("ENTER cerrar");
                res.render('login_admin', {
                title: 'Login Admin',
                band: 'true',
                msm : 'iniciar',
                username: ''

                        });

            }
            else{
                console.log("ENTER undefined");    
                res.clearCookie('remember');
                console.log("Session var: "+req.cookies.remember);
                res.render('login_admin', {
                    title: 'Login Admin',
                    band: 'true',
                    msm : 'expired',
                    username: ''

                            });

                console.log("Ha finalizado la sesion"); 

            }
             
        }
        else{
            next();
            console.log("ENTER sesion valida");
    
        }
    
    }
    

}

app.get('/contenido', function(req, res, next) {
    console.log("ENTER bien hp");
    now = new Date(Date.now());
    console.log("Now: "+now);
    //console.log("Expired: "+expired);
    
    expired = new Date(Date.now() + minute);
    console.log("Expired: "+expired);              
    res.cookie('remember', Number(req.cookies.remember) + 1, { maxAge: minute }); 
    res.render('page_contenido', {
        title: 'Subir Contenido', Nombre:req.cookies.remember
    });   
    
        

});

/*app.get('/contenido', function(req, res) {
    now = new Date(Date.now());
    console.log("Now: "+now);
    //console.log("Expired: "+expired);
    
    if (req.cookies.removeember) {
        expired = new Date(Date.now() + minute);
        //console.log("Expired: "+expired);              
        res.cookie('remember', Number(req.cookies.remember) + 1, { maxAge: minute }); 
        res.render('page_contenido', {
            title: 'Subir Contenido', Nombre:req.cookies.remember
        });   
    }
    else{
            console.log("ENTER");    
            res.clearCookie('remember');
            console.log("Session var: "+req.cookies.remember);
            res.render('login_admin', {
                title: 'Login Admin',
                band: 'true',
                msm : 'expired',
                username: ''

                        });

            console.log("Ha finalizado la sesion");
      
    }

        

});
*/

app.get('/ver', function(req, res) {
    res.render('ver', {
        title: 'ver html'
    });
});

    

app.get('/contenidos_subidos', function(req, res, next) {
    console.log("Session var INICIO: "+req.cookies.remember);
    now = new Date(Date.now());
    console.log("Now: "+now);
          expired = new Date(Date.now() + minute);
          console.log("Expired: "+expired);              
          res.cookie('remember', Number(req.cookies.remember) + 1, { maxAge: minute });
                
          MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          db.collection("Contenidos").find({}).toArray(function(err, result) {
            if (err) throw err;
             res.render('contenidos_subidos', {
                title: 'Escenas Guardadas',
                resultado: result
            });
             console.log("escenas: "+JSON.stringify(result));
            db.close();
          });
       
        });
           
       
    
});




app.get('/tt', function(req, res){
  //res.render('login_admin', { title: 'Login Admin' });
  res.render('test', {
    title: 'Login Admin'

            });
});
app.get('/subir_cont', function(req, res) {
    console.log("Session var INICIO: "+req.cookies.remember);
    now = new Date(Date.now());
    console.log("Now: "+now);
    /*if(now >= expired){
        verificarSesion(req, res, expired);
    }
    else{*/
    expired = new Date(Date.now() + minute);
    console.log("Expired: "+expired);              
    res.cookie('remember', Number(req.cookies.remember) + 1, { maxAge: minute });
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
              escenas:''
            });
            throw err;

        } else if (result.length > 0) {
                  res.render('subir_cont', {
                        title: 'Subir Contenido',
                        json: result[0].json,
                        escenas:''
                    });
                     
                db.close();
            

        } else {
            res.render('subir_cont', {
                title: 'Subir Contenido',
                json: '',
              escenas:'' 
            });

        }
        console.log(result.length);
        db.close();
    });
});



    
    

});

app.get('/config_json_2_pantalla', function(req, res) {
    console.log("Session var INICIO: "+req.cookies.remember);
    now = new Date(Date.now());
    console.log("Now: "+now);
    expired = new Date(Date.now() + minute);
    console.log("Expired: "+expired);              
    res.cookie('remember', Number(req.cookies.remember) + 1, { maxAge: minute });
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
                    json: '',
                    ip:''
                });
                throw err;

            } else if (result.length > 0) {

                console.log(JSON.stringify(result[0].json))
                getExternalIp(function (externalIp) {
                res.render('config_json_2_pantalla', {
                    title: 'Configuración Json',
                    json: result[0].json,
                    msm: 'OK',
                    ip:externalIp
                });
      });

            } else {
                getExternalIp(function (externalIp) {
         res.render('config_json_2_pantalla', {
                    title: 'Configuración Json',
                    json: '',
                    msm: 'OK',
                    ip:externalIp
                });

      });
               
            }
            console.log(result.length);
            db.close();
        });
    });
});
app.get('/config_json', function(req, res) {
    console.log("Session var INICIO: "+req.cookies.remember);
    now = new Date(Date.now());
    console.log("Now: "+now);
    expired = new Date(Date.now() + minute);
    console.log("Expired: "+expired);              
    res.cookie('remember', Number(req.cookies.remember) + 1, { maxAge: minute });
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

    // socket.broadcast.emit('move', data);

    socket.on('opcion_2c', function(data) {
        console.log('Sala:', data.sala);
        console.log('Sala:', data.option);
        io.to(data.sala).emit('opcion_1c', data.option);
    });
    socket.on('opciones', function(data) {
        // transmitimos el movimiento a todos los clienntes conectados
        console.log('Opciones:', data.opciones);
        io.to(data.sala).emit('op_second_screen', data.opciones);
    });
    socket.on('crearSala', function(data, callback) {
        // transmitimos el movimiento a todos los clienftes conectados
        console.log('Sala:', data.sala);
        socket.join(data.sala);
        callback({
            sala: data.sala
        });
    });
    socket.on('registrar_id_socket', function(data) {
        // transmitimos el movimiento a todos los clientes conectados
        console.log('is socket:', data.id_s);
        map_ids_idsonido.set(data.id_audio, data.id_s);

    });
    socket.on('unir_Sala', function(data) {
        // transmitimos el movimiento a todos los clientes conectados
        console.log('unir_Sala:', data.sala);
        console.log('Invitado:', data.invitado);
        var ids = map_ids_idsonido.get(data.invitado)
        socket.broadcast.to(ids).emit('invitacion_Sala', {
            sala: data.sala,
            invitado: data.invitado
        });
    });
    socket.on('disconnect', function() {
        connections--;
        console.log('connected', connections);
        map_ids_idsonido.remove(socket.id)
        socket.broadcast.emit('connections', {
            connections: connections
        });
    });
    
    //socket.emit('ips', ipsJson);

        
});
app.get('/movies/:movieName', (req, res) => {
    const movieName = req.params.movieName;
    const movieFile = './movies/' + movieName;

    screen(movieFile, res, req);
});
app.post('/upload', storage.multer.array('archivos', 50), (req, res, next) => {
    //El modulo 'fs' (File System) que provee Nodejs nos permite manejar los archivos
     var json_con = req.body.output2;
    var title = req.body.Titulo;
        console.log(json_con)
           for(var x=0;x<req.files.length;x++) {
       var dir= storage.sendUploadToGCS(req.files[x])
       json_con=json_con.replace(req.files[x].originalname,dir)
       console.log(dir)
    } 
       console.log(json_con)
       json_con=lzstring.compressToBase64(json_con);
             console.log(json_con)
            MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var myobj = {
            title: title,
            json: json_con
        };
        var query = {
            title: title
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
                                    resultado: result
                                });
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
                            resultado: result
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

function screen(path, res, req, ban) {
    var stat = fs.statSync(path);
    var total = stat.size;
    if (req.headers['range']) {
        var range = req.headers.range;
        var parts = range.replace(/bytes=/, "").split("-");
        var partialstart = parts[0];
        var partialend = parts[1];

        var start = parseInt(partialstart, 10);
        var end = partialend ? parseInt(partialend, 10) : total - 1;
        var chunksize = (end - start) + 1;
        console.log('RANGE : ' + start + ' - ' + end + ' = ' + chunksize);

        var file = fs.createReadStream(path, {
            start: start,
            end: end
        });

        res.writeHead(206, {
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
        });

        console.log('ALL: ');
        file.on('open', () => file.pipe(res));
        console.log('ALL2: ');
        file.on('end', function() { // done
            console.log("fin");

        });
        file.on('error', (streamErr) => res.end('errr' + streamErr));
    } else {
        console.log('ALL: ' + total);
        res.writeHead(200, {
            'Content-Length': total,
            'Content-Type': 'video/mp4'
        });
        var file = fs.createReadStream(path);
        file.on('open', () => file.pipe(res));
        file.on('end', function() { // done
            console.log("fin");

        });
    }

}

var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

var sha512f = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    console.log("sha512f salt: "+salt);
    console.log("sha512f pass: "+password);
    hash.update(password);
    var value = hash.digest('hex');
    console.log("sha512f value: "+value);
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    salt = genRandomString(16); /** Gives us salt of length 16 */
    passwordData = sha512f(userpassword, salt);
    console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
    console.log('nSalt = '+passwordData.salt);
}

var passwordMD5 = md5("awesome6");
console.log("awesome6: "+passwordMD5);
MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var myobj = { username: "sjcastro", password: passwordMD5};
      db.collection("users").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 record inserted");
      db.close();
      });
  });

app.post('/config_json2',function(req,res){
  var params;
  nombre=req.body.username;
  console.log("User name = "+nombre);
  //res.send(nombre);
  passwordHash=req.body.password;
  var salt=req.body.salt;
  var bytes  = CryptoJS.AES.decrypt( salt.toString(), 'My Secret Passphrase');
  var saltDecAes = bytes.toString(CryptoJS.enc.Utf8);
  console.log('saldDecrypt AES: ', saltDecAes);
  console.log("User name = "+nombre+", password is "+passwordHash+", salt is "+saltDecAes);
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
       db.collection("users").find({username: nombre}).toArray(function(err, result) {
        if (err) throw err;
        resultDB = result[1]; 
        resultStr = JSON.stringify(resultDB)
        console.log("dd: " +resultStr);
        resultStr = resultStr.replace('[','')
        resultStr = resultStr.replace(']','')
        console.log("frase2: "+ resultStr);
        finalPassDB = JSON.parse(resultStr); //password de la base
        console.log("PassDB: "+ finalPassDB.password);

        params = sha512f(finalPassDB.password, saltDecAes); 
        console.log("Param HashPassDB: "+ params.passwordHash);
        var compare = params.passwordHash.localeCompare(passwordHash);
        if(compare == 0){
            var id_session = Math.round(Date.now()*Math.random()/100000);
            console.log("CORRECTO");
            flagSession = true;
            console.log("id: "+id_session); 
            expired = new Date(Date.now() + (200000));
            console.log("now: "+new Date(Date.now())+" expired: "+expired);
            //res.redirect('/contenido');
            //req.session.mivariable=id_session;
            res.cookie('remember', 1, { maxAge: minute });
            res.render('page_contenido',{Titulo:'contenido', band: 'true', Nombre:id_session, Expire:expired});

 }
        else{
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
app.get('/', function(req, res){
  res.render('index', { title: '1 Pantalla DEMO' });
});

app.get('/qr', function (req,res) {  
        res.render('QR', {
            title: 'QR',
            room : Math.round(Date.now()*Math.random()/100000),
            
                    });
        //console.log("Ha finalizado la sesion");
        //flagSession = false;
});

app.get('/cerrar2',function (req,res) {
        delete req.session.mivariable;
        res.render('login_admin', {
            title: 'Login Admin',
            band: 'false',
            msm : 'OK',
            username: ''

                    });
        console.log("Ha finalizado la sesion");
        flagSession = false;
    });


app.get('*', function(req, res){
  if(expired == null){
    res.render('login_admin', {
    title: 'Login Admin',
    band: 'false',
    msm : 'OK',
    username: ''

            });
  }
  else{
    res.render('page_contenido',{Titulo:'contenido'});
  }
  
});
function verificarSesion(req, res, expired){
    console.log("Expired: "+expired);
    console.log("ENTER");    
    res.clearCookie('remember');
    console.log("Session var: "+req.cookies.remember);
    if(expired == null){
        console.log("ENTER expire null"); 
        res.render('login_admin', {
        title: 'Login Admin',
        band: 'true',
        msm : 'iniciar',
        username: ''

                });

    }else{
        console.log("ENTER expired"); 
        res.render('login_admin', {
        title: 'Login Admin',
        band: 'true',
        msm : 'expired',
        username: ''

                });
    }
    

    console.log("Ha finalizado la sesion");
}

function stringGen(len)
      {
          var text = " ";
      
          var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
      
          for( var i=0; i < len; i++ )
              text += charset.charAt(Math.floor(Math.random() * charset.length));
      
          return text;
      }
var METADATA_NETWORK_INTERFACE_URL = 'http://metadata/computeMetadata/v1/' +
    '/instance/network-interfaces/0/access-configs/0/external-ip';



function getExternalIp (cb) {
  var options = {
    url: METADATA_NETWORK_INTERFACE_URL,
    headers: {
      'Metadata-Flavor': 'Google'
    }
  };

  request(options, function (err, resp, body) {
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