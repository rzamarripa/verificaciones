angular
.module("verificaciones")
.controller("verificacionCtrl", verificacionCtrl);
function verificacionCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);

  this.action = true;
	this.subscribe('folios',()=>{
			return [{verificador_id: Meteor.user()}]
	});

  this.helpers({
	  folios : () => {
		  return Folios.find();
	  }
  });
  
};