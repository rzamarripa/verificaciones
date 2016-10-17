angular
  .module('verificaciones')
  .controller('ZonaCtrl', ZonaCtrl);
 
function ZonaCtrl($scope, $meteor, $reactive, $state, toastr) {
	$reactive(this).attach($scope);
	this.action = true;
	this.subscribe('zona',()=>{
		return [{}]
	});
  
  this.helpers({
		zonas : () => {
		  return Zona.find();
	  }
  });
  	  
  this.nuevo = true;	  
  this.nuevoZona = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.zona = {};		
  };
	
  this.guardar = function(zona,form)
	{
			if(form.$invalid){
	      toastr.error('Error al guardar los datos.');
	      return;
	    }
			
			zona.estatus = true;
			zona.usuarioInserto = Meteor.userId();
			Zona.insert(zona);
			toastr.success('Guardado correctamente.');
			zona = {};
			$('.collapse').collapse('hide');
			this.nuevo = true;
			$state.go('root.zona');
			form.$setPristine();
	    form.$setUntouched();
	};
	
	this.editar = function(id)
	{
	    this.zona = Zona.findOne({_id:id});
	    this.action = false;
	    $('.collapse').collapse('show');
	    this.nuevo = false;
	};
	
	this.actualizar = function(zona,form)
	{
	    if(form.$invalid){
	        toastr.error('Error al actualizar los datos.');
	        return;
	    }
		 	var idTemp = zona._id;
			delete zona._id;		
			zona.usuarioActualizo = Meteor.userId(); 
			Zona.update({_id:idTemp},{$set:zona});
			toastr.success('Actualizado correctamente.');
			//console.log(ciclo);
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
	};
		
	this.cambiarEstatus = function(id)
	{
			var zona = Zona.findOne({_id:id});
			if(zona.estatus == true)
				zona.estatus = false;
			else
				zona.estatus = true;
			
			Zona.update({_id:id}, {$set : {estatus : zona.estatus}});
	};	
};