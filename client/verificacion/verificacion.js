angular
.module("verificaciones")
.controller("verificacionCtrl", verificacionCtrl);
function verificacionCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);

  this.action = true;
	this.subscribe('folios',()=>{
			return [{estatus: "2",verificador_id: Meteor.user() != undefined ? Meteor.user()._id : ""}]
	});//Estatus 2 :  Asignado

	this.subscribe('ciudad',()=>{
		return [{estatus: true}]
	});

  this.helpers({
	  folios : () => {
		  return Folios.find();
	  },
	  ciudades : () => {
		  return Ciudad.find();
	  }
  });
  
  this.getCiudad = function(ciudad_id)
	{		
			var ciudad = Ciudad.findOne({_id:ciudad_id});

			if (ciudad)
				 return ciudad.nombre;
				 
	};
  
};