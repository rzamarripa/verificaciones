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
	
	this.subscribe('zona',()=>{
		return [{estatus: true}]
	});


  this.helpers({
	  folio : () => {
		  return Folios.findOne();
	  },
	   usuarios: ()=> {
		  return Meteor.users.find({roles : ["Verificador"]});
	  },
	  zonas : () => {
		  return Zona.find();
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
			
			folio.verificacionRazon = "";
			//console.log(folio);
			
			if (folio.estatusPorVisitar == true)
				 folio.verificacionEstatus = "6"; 	//Por Visitar
			else
				folio.verificacionEstatus = "2";		//Asignado
			
			Folios.update({_id:idTemp},{$set:folio});
			toastr.success('Actualizado correctamente.');
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
	    $state.go('root.panelFolios');		
	};
	
	this.getZona = function(zona_id)
	{		
			var zona = Zona.findOne({_id:zona_id});
			if (zona)
				 return zona.nombre;		 
	};
};