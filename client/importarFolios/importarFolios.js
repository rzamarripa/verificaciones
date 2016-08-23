


angular
.module("verificaciones")
.controller("importarFoliosCtrl", importarFoliosCtrl);
function importarFoliosCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);

  this.action = true;
	this.subscribe('folios',()=>{
			return [{}]
	});
	
	this.subscribe('usuarios',()=>{
		return [{"profile.estatus": true, roles: ["Analista"]}]
	});

  this.helpers({
	  folios : () => {
		  return Folios.find();
	  },
	  usuarios: ()=> {
		  return Meteor.users.find({roles : ["Analista"]});
	  }
  });
  
  this.nuevo = true;  
 
	this.cargar = function()
	{	
			demos();
			/*var X = XLSX;
			console.log(X);
			
		  var files = $('#files')[0].files;
  

		  
		  if	(typeof require !== 'undefined') 
		  		XLSX = require('xlsx');
			
			console.log(XLSX);
			var workbook = XLSX.readFile(files[0].name);
			/* DO SOMETHING WITH workbook HERE */
		  
		  
		  	  
	};
	
};




function demos(data) {
	var X = XLSX;
	console.log(X)

	  		
		  		
		  		
}