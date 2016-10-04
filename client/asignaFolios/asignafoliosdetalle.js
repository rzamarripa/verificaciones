angular
.module("verificaciones")
.controller("asignaFoliosDetalleCtrl", asignaFoliosDetalleCtrl);
function asignaFoliosDetalleCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);

  this.action = true;
	this.subscribe('folios',()=>{
			return [{_id: $stateParams.id}]
	});
	
	this.subscribe('usuarios',()=>{
		return [{"profile.estatus": true, roles: ["Verificador"]}]
	});
	
	this.subscribe('ciudad',()=>{
		return [{estatus: true}]
	});


  this.helpers({
	  folio : () => {
		  return Folios.findOne();
	  },
	   usuarios: ()=> {
		  return Meteor.users.find({roles : ["Verificador"]});
	  },
	  ciudades : () => {
		  return Ciudad.find();
	  }
  });
  	
	this.actualizar = function(folio,form)
	{
			if(form.$invalid){
		        toastr.error('Error al guardar los datos.');
		        return;
		  }
			
			var idTemp = folio._id;
			delete folio._id;		
			folio.usuarioActualizo = Meteor.userId(); 
			
			console.log(folio);
			
			if (folio.estatusPorVisitar == true)
				 folio.estatus = "6"; //Por Visitar
			else
				folio.estatus = "2";//Asignado
			
			Folios.update({_id:idTemp},{$set:folio});
			toastr.success('Actualizado correctamente.');
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
	    $state.go('root.panelFolios');		
	};
	
	this.getCiudad = function(ciudad_id)
	{		
			var ciudad = Ciudad.findOne({_id:ciudad_id});

			if (ciudad)
				 return ciudad.nombre;
				 
	};
	
};