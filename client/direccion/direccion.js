angular
.module("verificaciones")
.controller("DireccionCtrl", DireccionCtrl);
function DireccionCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {
	
	let rc = $reactive(this).attach($scope);
	
	Window = rc;
	
	this.buscar = {};
  this.buscar.fechaInicial = new Date();
  this.buscar.fechaFinal = new Date();
  
  this.verificadores_id = [];
  this.fechaInicial = moment(new Date()).format("DD-MM-YYYY");
  this.fechaFinal = moment(new Date()).format("DD-MM-YYYY");



};