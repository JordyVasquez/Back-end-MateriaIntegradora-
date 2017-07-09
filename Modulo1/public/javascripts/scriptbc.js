$(function(){

  var url = 'http://' + window.location.host;
  var dir_movies='/movies/'
  var text = '{ "escena":[{"next_escenas":[' +
							'{"escena":[' +
								'{"next_escenas":[' +
										'{"escena":['+
											'{"next_escenas":""},'+
											'{"src":"save_him.mp4"}' +
										']},'+
										'{"escena":['+
											'{"next_escenas":""},' +
											'{"src":"save_him.mp4"}' +
										']}]},'+
								'{"src":"save_him.mp4"}]},' +
							'{"escena":[' +
								'{"next_escenas":[' +
										'{"escena":['+
											'{"next_escenas":""},'+
											'{"src":"leave_it.mp4"}' +
										']},'+
										'{"escena":['+
											'{"next_escenas":""},' +
											'{"src":"leave_it.mp4"}' +
										']}]},'+
								'{"src":"leave_it.mp4"}]}]},' +
						'{"src":"inicial.mp4"}]' +
			  '}';

var videos_seq = JSON.parse(text);
 var id = Math.round($.now()*Math.random()/100000);

    // abrimos la conexion
  var socket = io.connect(url);

 socket.on('connect', function(){
        socket.emit('crearSala', {sala : id}, function(data){
            $('#identificador').html(data.sala);
       })

    });
	var btnplay = document.getElementById("play");
	btnplay.addEventListener('click', play);
var video = document.getElementById("video_principal");
video.src = dir_movies+videos_seq.escena[1].src;
video.load();  // if HTML source element is used

video.addEventListener("ended", function () {
          var fileURL = "/movies/h3mBeVNzVeo.mp4"; // get input field                    
     		var escenas=searchVideoOnArray(video.src,videos_seq);
		socket.emit('opciones', {sala : id,opciones:{escenas}});
              //video.src = fileURL;
              //video.load();  // if HTML source elementj is used
			   //video.play();
          });
		   /*video.addEventListener("timeupdate", function () {
									
						 var vTime = video.currentTime;
			if(vTime>=11 && vTime <=12){ 
			video.pause();
     		var escenas=searchVideoOnArray(video.src,videos_seq);
		    socket.emit('opciones', {sala : id,opciones:{escenas}});
						  }
          });*/
 socket.on('opcion_1c',function(e){
 
   var fileURL = dir_movies+e; // get input field                    
     
              video.src = fileURL;
			  video.play();
});

function searchVideoOnArray(nameKey, myArray) {
 if ((url+dir_movies+myArray.escena[1].src) === (nameKey)) {
            return myArray.escena[0].next_escenas;
        }
		if( myArray.escena[0].next_escenas!=''){
    for (var i = 0; i < myArray.escena[0].next_escenas.length; i++) {
        var res=searchVideoOnArray(nameKey, myArray.escena[0].next_escenas[i])
		if(res!=''){
		break;
		}
    }
	return res;
	}
	return '';
}
  function play(){
var video = document.getElementById("video_principal");
video.play();
   }
});