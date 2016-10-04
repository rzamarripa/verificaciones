angular
.module("verificaciones")
.controller("buscarFolioCtrl", buscarFolioCtrl);
function buscarFolioCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);
	
	this.buscar = {};
	this.buscar.folio = '';
	
	this.subscribe('buscarFolio', () => {
    return [{
	    options : { limit: 20 },
	    where : { 
		    folio : this.getReactively('buscar.folio') 		  
		  }  
    }];
  });
  
	this.subscribe('ciudad',()=>{
		return [{estatus: true}]
	});

	/*
	this.subscribe('folios',()=>{
			return [{folio: this.getReactively('folio')}]
	});
	*/
	this.subscribe('usuarios',()=>{
		return [{"profile.estatus": true, roles: ["Analista"]}]
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
	
	this.getCiudad = function(ciudad_id)
	{		
			var ciudad = Ciudad.findOne({_id:ciudad_id});

			if (ciudad)
				 return ciudad.nombre;
				 
	};
};