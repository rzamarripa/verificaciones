angular
.module("verificaciones")
.controller("panelFoliosAnalistaCtrl", panelFoliosAnalistaCtrl);
function panelFoliosAnalistaCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);
	
	Window = rc;
	
  //this.action = true;
	this.subscribe('foliosPanel',()=>{
			return [{verificacionEstatus :{$gte:"1",$lt:"7"}, folioEstatus: "1" , analista_id:  Meteor.userId() }]
	});
		
	this.subscribe('logistica',()=>{
		return [{"profile.estatus": true}]
	});
	
	this.subscribe('zona',()=>{
		return [{estatus: true}]
	});

  this.helpers({
	  folios : () => {
		  return Folios.find();
	  },
	  foliosPorLlamar : () => {
		  return Folios.find({analista_id: Meteor.user() != undefined ? Meteor.user()._id : "" ,folioEstatus : "1", $or:[{verificacionEstatus :"1"},
																																																										 {verificacionEstatus :"2"}				  			
		  																																																							]}).fetch();
	  },	  
	  foliosVisitados : () => {	
		  var visitados = Folios.find({verificacionEstatus : "3", verificacionRazon: {$ne : "No encontrado cliente"} }).fetch();
		  if(visitados){
			  //console.log(visitados)
			  return Folios.find({verificacionEstatus : "3", verificacionRazon: {$ne : "No encontrado cliente"} }).fetch();
		  }
	  },
	  foliosVisitadosSegundaVisita : () => {
		  return Folios.find({verificacionEstatus : "3", verificacionRazon: "No encontrado cliente"}).fetch();
	  },
		foliosNoEncontrados : () => {
		  return Folios.find({verificacionEstatus : "4"}).fetch();
	  },
	  foliosNoVisitados : () => {
		  return Folios.find({verificacionEstatus : "5"}).fetch();
	  },
	  zonas : () => {
		  return Zona.find();
	  }
  });
  
  /*
  this.nuevo = true;  
  this.nuevoFolio = function()
  {
			this.action = true;
		  this.nuevo = !this.nuevo;
		  this.folio = {}; 
  };
 
	this.guardar = function(folio,form)
	{
			if(form.$invalid){
		        toastr.error('Error al guardar los datos.');
		        return;
		  }
						
			folio.estatus = 'Pendiente';
			folio.usuarioInserto = Meteor.userId();
			Folios.insert(folio);
			toastr.success('Guardado correctamente.');
			this.folio = {};
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
			$state.go('root.folios');
		
	};
	
	this.editar = function(id)
	{
	    this.folio = Folios.findOne({_id:id});
			this.action = false;
			$('.collapse').collapse('show');
			this.nuevo = false;
	};
	*/
	this.actualizar = function(folio,form)
	{
			if(form.$invalid){
		        toastr.error('Error al guardar los datos.');
		        return;
		  }
			console.log(folio);
			var idTemp = folio._id;
			delete folio._id;		
			folio.usuarioActualizo = Meteor.userId(); 
			folio.verificoAnalista = Meteor.userId();
			Folios.update({_id:idTemp},{$set:folio});
			toastr.success('Actualizado correctamente.');
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
	};
		
	this.finalizarFolio = function(id)
	{
			var folio = Folios.findOne({_id:id});
			folio.folioEstatus = "2";			//Folio Finalizado
			Folios.update({_id:id}, {$set : {folioEstatus : folio.folioEstatus}});		
	};
	
	this.llamadoFolio = function(id)
	{
			var folio = Folios.findOne({_id:id});
			console.log(folio);
			folio.EsLlamado = "1";			//Folio Llamado por el analista
			Folios.update({_id:id}, {$set : {EsLlamado : "1"}});
	};
		
	this.getAnalista = function(usuario_id)
	{		
			var usuario = Meteor.users.findOne({_id:usuario_id});

			if (usuario)
				 return usuario.profile.nombre;
				 
	};
	
	this.getVerificador = function(usuario_id)
	{		
			var usuario = Meteor.users.findOne({_id:usuario_id});

			if (usuario)
				 return usuario.profile.nombre;
				 
	};
	
	this.getZona = function(zona_id)
	{		
			var zona = Zona.findOne({_id:zona_id});

			if (zona)
				 return zona.nombre;
				 
	};

};