angular
.module("verificaciones")
.controller("verificacionDetalleCtrl", verificacionDetalleCtrl);
function verificacionDetalleCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);
	
	Window = rc;
	
	
	this.fecha = {};
	this.imagenSeleccionada = "";
	this.fechavisita = new Date();
	
/*
	var myCanvas = document.getElementById("myCanvas");
	ctx = myCanvas.getContext("2d");
*/

	

	this.subscribe('zona',()=>{
		return [{estatus: true}]
	});
	
	this.helpers({
	  zonas : () => {
		  return Zona.find();
	  }
  });
	
	this.op = $stateParams.op;

  this.action = true;
  this.folios = [{
  								id : 3,
								  nombre : "Visitó"
							  },
							  { 
  								id : 4,
								  nombre : "No Encontró"
							  },
							  {
  								id : 5,
								  nombre : "No Visitó"
							  }];
	this.razones = [];
	this.subscribe('folios',()=>{

			return [{_id: $stateParams.id}]//Estatus 2: Asignado , estatus: 2
	});
	
	
  this.guardarPizarron = function(imagen){
	  var folio = Folios.findOne();
	  console.log(folio);
	  if(folio){
		  Folios.update({_id:$stateParams.id}, {$set:{firma:imagen}});
		}
		/*else{
			Pizarrones.insert({imagen:imagen,grupo_id:this.grupo});
		}*/
  }
	
	this.autorun(() => {
   	var imagsrc = this.getReactively('folio.firma');
   	var image = new Image();
   	//console.log(imagsrc);
   	if(imagsrc && imagsrc.imagen ){
   		image.src = imagsrc.imagen;
   		ctx.drawImage(image,0,0);
   	}
  });

  this.helpers({
	  folio : () => {
	  	var folioActual = Folios.findOne();
	  	if(folioActual){
	  		folioSel = folioActual.verificacionEstatus;
		  	//console.log(folioSel);
				if(folioSel == 3){
					//console.log("pos");
					rc.razones = [{nombre : "Realizado"},
												{nombre : "Familiares"},
												{nombre : "Fraude"},
												{nombre : "Cambio domicilio"},
												{nombre : "Domicilio deshabitado"},
												{nombre : "Domicilio laboral"},
												{nombre : "Domicilio bajas condiciones"},
												{nombre : "Vecinos confirman"},
												{nombre : "Vecinos no conocen"},
												{nombre : "No encontrado cliente"},];
				}else if(folioSel == 4){
					//console.log("neg");
					rc.razones = [{nombre : "No hay acceso"},
												{nombre : "Zona de riesgo"}];
				}else{
					rc.razones = [{nombre : "No encontró domicilio"}];
		
				}
				return folioActual;
	  	}
	  }
  });
  
   
  this.actualizar = function(folio,form)
	{			
			
			if(form.$invalid){
		        toastr.error('Error al guardar los datos.');
		        return;
		  }
		  //tipo
		  var tip = $stateParams.tip;
		  
		  //console.log(this.fechavisita);
		  //console.log("FechaVisita: ",folio.fechavisita);
		  if (!folio.fechavisita)
		  	 folio.fechavisita = this.fechavisita;
		  
		  
		  if (tip == 2)
		   	 folio.verificoAnalista = Meteor.userId();
		  		  
			var idTemp = folio._id;
			delete folio._id;		
			
			
			Folios.update({_id:idTemp},{$set:folio}, 
																			function(error,result){
																				if (error){
																					  console.log("Error:",error);
																				}	  
																				if (result)
																				{
																						toastr.success('Actualizado correctamente.');
																						$('.collapse').collapse('hide');
																						this.nuevo = true;
																						form.$setPristine();
																				    form.$setUntouched();
																				}	 
																			}
																	);
			
	    
	   
	    
	    if (tip == 1)
	    	$state.go('root.verificacion');
	    else
	    	$state.go('root.panelFoliosAnalista');	
	};
  
  	this.tomarFoto = function(){
			$meteor.getPicture().then(function(data){
			rc.folio.evidencia = data;
		});
	};
	
	this.finalizar = function(id)
	{

			var folio = Folios.findOne({_id:id});

			folio.folioEstatus = "2"; //Folio Finalizado
			
			Folios.update({_id:id}, {$set : {verificacionEstatus : folio.verificacionEstatus}});
			$state.go('root.home');
	};
	
	this.mostrarImagen = function(imagen)
	{
			console.log(imagen);
			this.imagenSeleccionada = imagen;
			$('#myModal').modal('show')
	};

	
	this.resetCanvas = function()
	{
			canvas = document.getElementById("myCanvas");
			ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
	};
	
	this.getRazones = function(folioSel){

		if(folioSel.verificacionEstatus == 3){

			rc.razones = [{nombre : "Realizado"},
										{nombre : "Familiares"},
										{nombre : "Fraude"},
										{nombre : "Cambio domicilio"},
										{nombre : "Domicilio deshabitado"},
										{nombre : "Domicilio laboral"},
										{nombre : "Domicilio bajas condiciones"},
										{nombre : "Vecinos confirman"},
										{nombre : "Vecinos no conocen"},
										{nombre : "No encontrado cliente"},];
										
										
										
		  
		}else if(folioSel.verificacionEstatus == 4){

			rc.razones = [{nombre : "No hay acceso"},
										{nombre : "Zona de riesgo"}];
								
			
			folioSel.numeroTarjeta = "n/a";							
			folioSel.fechavisita =  new Date();
			folioSel.atendio = "n/a";
			folioSel.parentesco = "n/a";
			folioSel.identificacion = "n/a";
			folioSel.medidor = "n/a";
			folioSel.colorcasa = "n/a";
			folioSel.pisos = 0;
			folioSel.puertacolor = "n/a";
			folioSel.barandalcolor = "n/a";
			folioSel.personashabitan = 0;
			folioSel.aniosviviendo = 0;
			
			
			
			
		}else{
			rc.razones = [{nombre : "No encontró domicilio"}];
			
			folioSel.numeroTarjeta = "n/a";	
			folioSel.fechavisita =  new Date();
			folioSel.atendio = "n/a";
			folioSel.parentesco = "n/a";
			folioSel.identificacion = "n/a";
			folioSel.medidor = "n/a";
			folioSel.colorcasa = "n/a";
			folioSel.pisos = 0;
			folioSel.puertacolor = "n/a";
			folioSel.barandalcolor = "n/a";
			folioSel.personashabitan = 0;
			folioSel.aniosviviendo = 0;
		}
	};
	
	
	this.AlmacenaImagen = function(imagen, op)
	{
			if (op == 1)
			{
					this.folio.Imagen1 = imagen;
					//console.log(this.folio);
			}
			else if (op == 2){
					this.folio.Imagen2 = imagen;
					//console.log(this.folio);
			}else{
					this.folio.tarjetaImagen = imagen;
					//console.log(this.folio);
			}
		
	}
	
	/*
	this.add = function(){
	  var f = document.getElementById('file').files[0],
	      r = new FileReader();
	  r.onloadend = function(e){
	    var data = e.target.result;
	    //send your binary data via $http or $resource or do anything else with it
	    console.log(data);
	  }
	  r.readAsArrayBuffer(f);
	   
	};
	*/
	
	$(document).ready( function() {
		
		//Para Cargar Imagenes
		var fileInput = document.getElementById('fileInput');
		var fileDisplayArea = document.getElementById('fileDisplayArea');
		
		var fileInput1 = document.getElementById('fileInput1');
		var fileDisplayArea1 = document.getElementById('fileDisplayArea1');
		
		var fileInput2 = document.getElementById('fileInput2');
		var fileDisplayArea2 = document.getElementById('fileDisplayArea2');
		
		
		var canvas=document.getElementById("myCanvas");
    

  var signaturePad = null;


  signaturePad = new SignaturePad(canvas);
  signaturePad.minWidth = 1;
  signaturePad.maxWidth = 2;
  signaturePad.penColor = "rgb(4, 4, 4)";
	    
    // Fill Window Width and Height
/*
    myCanvas.width = window.innerWidth;
		myCanvas.height = window.innerHeight;
*/
		
		// Set Background Color
/*
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,myCanvas.width,myCanvas.height);
*/
		
		// Mouse Event Handlers
/*
		if(myCanvas){
			rc.isDown = false;
			var canvasX, canvasY;
			ctx.lineWidth = 5;
			
			$(myCanvas)
			.mousedown(function(e){
				
				rc.isDown = true;
				ctx.beginPath();
				canvasX = e.pageX - myCanvas.offsetLeft;
				canvasY = e.pageY - myCanvas.offsetTop;
				ctx.moveTo(canvasX, canvasY);
			})
			.mousemove(function(e){
				if(rc.isDown !== false) {
					canvasX = e.pageX - myCanvas.offsetLeft;
					canvasY = e.pageY - myCanvas.offsetTop;
					ctx.lineTo(canvasX, canvasY);
					ctx.strokeStyle = "#000";
					ctx.stroke();					
				}
			})
			.mouseup(function(e){
				rc.guardarPizarron(myCanvas.toDataURL("image/png"));
				rc.isDown = false;
				ctx.closePath();

				
			});
		}
*/
		
		// Touch Events Handlers
/*
		draw = {
			started: false,
			start: function(evt) {
				ctx.beginPath();
				ctx.moveTo(
					evt.touches[0].pageX,
					evt.touches[0].pageY
				);
	
				this.started = true;
				
			},
			move: function(evt) {
	
				if (this.started) {
					ctx.lineTo(
						evt.touches[0].pageX,
						evt.touches[0].pageY
					);
	
					ctx.strokeStyle = "#000";
					ctx.lineWidth = 5;
					ctx.stroke();
				}
			
	
			},
			end: function(evt) {
				this.started = false;
				
			}
		};
*/
		// Touch Events
/*
		myCanvas.addEventListener('touchstart', draw.start, false);
		myCanvas.addEventListener('touchend', draw.end, false);
		myCanvas.addEventListener('touchmove', draw.move, false);
		
*/
		// Disable Page Move
/*
		document.body.addEventListener('touchmove',function(evt){
			evt.preventDefault();
		},false);
*/
		
		//JavaScript para agregar la imagen 0
		fileInput1.addEventListener('change', function(e) {
			var file = fileInput1.files[0];
			var imageType = /image.*/;

			if (file.type.match(imageType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					fileDisplayArea1.innerHTML = "";

					var img = new Image();
					img.src = reader.result;

					rc.AlmacenaImagen(reader.result,1);
					//this.folio.imagen = reader.result;
					
					fileDisplayArea1.appendChild(img);
					
				}
				
				reader.readAsDataURL(file);	
			} else {
				fileDisplayArea1.innerHTML = "File not supported!";
			}
		});

		
		//JavaScript para agregar la imagen 1
		fileInput2.addEventListener('change', function(e) {
			var file = fileInput2.files[0];
			var imageType = /image.*/;
			console.log(file);
			if (file.type.match(imageType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					fileDisplayArea2.innerHTML = "";

					var img = new Image();
					img.src = reader.result;

					rc.AlmacenaImagen(reader.result,2);
					//this.folio.imagen1 = reader.result;
					
					fileDisplayArea2.appendChild(img);
					//console.log(fileDisplayArea1);
				}
				
				reader.readAsDataURL(file);	
			} else {
				fileDisplayArea2.innerHTML = "File not supported!";
			}
		});
		
			//JavaScript para agregar la imagen 2 Tarjeta
		fileInput.addEventListener('change', function(e) {
			var file = fileInput.files[0];
			var imageType = /image.*/;
			console.log(file);

			if (file.type.match(imageType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					fileDisplayArea.innerHTML = "";

					var img = new Image();
					img.src = reader.result;
					
					rc.AlmacenaImagen(reader.result,3);
					//this.folio.imagen2 = reader.result;
					
					fileDisplayArea.appendChild(img);
				}
				
				reader.readAsDataURL(file);	
			} else {
				fileDisplayArea.innerHTML = "File not supported!";
			}
		});

		
		
	});
	
};





