angular
.module("verificaciones")
.controller("verificacionCtrl", verificacionCtrl);
function verificacionCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);

  this.action = true;
	this.subscribe('folios',()=>{
			return [{folioEstatus: "1", verificacionEstatus :{$gte:"2",$lt:"6"}, verificador_id: Meteor.user() != undefined ? Meteor.user()._id : ""}]
	});
	//Estatus 2 :  Asignado

	this.subscribe('zona',()=>{
		return [{estatus: true}]
	});

  this.helpers({
	  folios : () => {
		  return Folios.find();
	  },
	  PorVerificar : () => {
		  return Folios.find({verificacionEstatus : "2"}, { sort : {zona_id : 1 } } ).fetch();
	  },
	  Verificados : () => {
		  var verificados = Folios.find({folioEstatus: "1", verificacionEstatus : "3", verificacionRazon: {$ne : "No encontrado cliente"} }).fetch();
		  if(verificados){
			  return Folios.find({folioEstatus: "1", verificacionEstatus : "3", verificacionRazon: {$ne : "No encontrado cliente"} }).fetch();
		  }
	  },
	  SegundaVisita : () => {
		  return Folios.find({$or: [ {verificacionRazon: "No encontrado cliente" }, { verificacionRazon: "No encontró domicilio" }]}, { sort : {zona_id : 1 } }).fetch();
	  },
	  zonas : () => {
		  return Zona.find();
	  }
  });
  
 this.getZona = function(zona_id)
	{		
			var zona = Zona.findOne({_id:zona_id});

			if (zona)
				 return zona.nombre;
				 
	};
  
};