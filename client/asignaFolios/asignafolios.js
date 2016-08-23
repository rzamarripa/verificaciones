angular
.module("verificaciones")
.controller("asignaFoliosCtrl", asignaFoliosCtrl);
function asignaFoliosCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);

  this.action = true;
	this.subscribe('folios',()=>{
			return [{estatus: 'Nuevo'}]
	});
	
  this.helpers({
	  folios : () => {
		  return Folios.find();
	  },
  });
};