angular
  .module('verificaciones')
  .controller('CiudadCtrl', CiudadCtrl);
 
function CiudadCtrl($scope, $meteor, $reactive, $state, toastr) {
	$reactive(this).attach($scope);
	this.action = true;
	this.subscribe('ciudad',()=>{
		return [{}]
	});
  
  this.helpers({
		ciudades : () => {
		  return Ciudad.find();
	  }
  });
  	  
  this.nuevo = true;	  
  this.nuevoCiudad = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.ciudad = {};		
  };
	
  this.guardar = function(ciudad,form)
	{
			if(form.$invalid){
	      toastr.error('Error al guardar los datos.');
	      return;
	    }
			
			ciudad.estatus = true;
			ciudad.usuarioInserto = Meteor.userId();
			Ciudad.insert(ciudad);
			toastr.success('Guardado correctamente.');
			ciudad = {};
			$('.collapse').collapse('hide');
			this.nuevo = true;
			$state.go('root.ciudad');
			form.$setPristine();
	    form.$setUntouched();
	};
	
	this.editar = function(id)
	{
	    this.ciudad = Ciudad.findOne({_id:id});
	    this.action = false;
	    $('.collapse').collapse('show');
	    this.nuevo = false;
	};
	
	this.actualizar = function(ciudad,form)
	{
	    if(form.$invalid){
	        toastr.error('Error al actualizar los datos.');
	        return;
	    }
		 	var idTemp = ciclo._id;
			delete ciudad._id;		
			ciudad.usuarioActualizo = Meteor.userId(); 
			Ciudad.update({_id:idTemp},{$set:ciudad});
			toastr.success('Actualizado correctamente.');
			//console.log(ciclo);
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
	};
		
	this.cambiarEstatus = function(id)
	{
			var ciudad = Ciudad.findOne({_id:id});
			if(ciudad.estatus == true)
				ciudad.estatus = false;
			else
				ciudad.estatus = true;
			
			Ciudad.update({_id:id}, {$set : {estatus : ciudad.estatus}});
	};	
};