angular
.module("verificaciones")
.controller("asignaFoliosCtrl", asignaFoliosCtrl);
function asignaFoliosCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);

  this.action = true;
	this.subscribe('folios',()=>{
			return [{estatus: "1"}]//Pendiente
	});
	
	this.subscribe('usuarios',()=>{
		return [{"profile.estatus": true, roles: ["Analista"]}]
	});
	
	this.subscribe('ciudad',()=>{
		return [{estatus: true}]
	});
	
  this.helpers({
	  folios : () => {
		  return Folios.find();
	  },
	  usuarios: ()=> {
		  return Meteor.users.find({roles : ["Analista"]});
	  },
	  ciudades : () => {
		  return Ciudad.find();
	  }
  });
   
  this.getAnalista = function(usuario_id)
	{		
			var usuario = Meteor.users.findOne({_id:usuario_id});
			if (usuario)
				 return usuario.profile.nombre;		 
	};
};