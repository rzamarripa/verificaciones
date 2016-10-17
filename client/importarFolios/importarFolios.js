
angular
.module("verificaciones")
.controller("importarFoliosCtrl", importarFoliosCtrl);
function importarFoliosCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);

	
  this.action = true;
  this.foliosArreglo = {};
  
	this.subscribe('folios',()=>{
			return [{  $and:[ {folioEstatus: "2"}
												,{$or: [{verificacionEstatus: "4" }, { verificacionEstatus: "5" }]}
							 					,{$or: [{verificacionRazon: "No hay acceso" }, { verificacionRazon: "Zona de riesgo" }, { verificacionRazon: "No encontró domicilio" }]}
							 				]
						  }]
	});
	
	this.subscribe('usuarios',()=>{
		return [{"profile.estatus": true, roles: ["Analista"]}]
	});
		
	this.subscribe('zona',()=>{
		return [{estatus: true}]
	});

  this.helpers({
	  folios : () => {
		  return Folios.find();
	  },
	  usuarios: ()=> {
		  return Meteor.users.find({roles : ["Analista"]});
	  },
	  zonas : () => {
		  return Zona.find();
	  }
  });
  
  this.nuevo = true;  
 
	this.cargar = function()
	{	
			
					 
	};
	
	this.guardar = function()
	{	
			if (rc.foliosArreglo.Hoja1.length == 0){
					 toastr.error('Error al guardar los datos.');
		       return;
		  }
		  
		  for (var i=0; i<rc.foliosArreglo.Hoja1.length;i++)
		  {
					//console.log(rc.foliosArreglo.Hoja1[i].existe);
					//if (!rc.foliosArreglo.Hoja1[i].existe)
					//{	
							f = {folio:"",nombre:"",fecha:"",zona_id:"",plan:"",prioridad:"",verificacionEstatus:"",verificacionRazon:"",folioEstatus:"",analista_id:"",usuarioInserto:""};
							f.folio = rc.foliosArreglo.Hoja1[i].Folio;
							f.nombre = rc.foliosArreglo.Hoja1[i].Nombre;
							f.fecha = new Date(rc.foliosArreglo.Hoja1[i].Fecha);
							
							console.log(rc.foliosArreglo.Hoja1[i].Zona);	
							var zona = Zona.findOne({"nombre":rc.foliosArreglo.Hoja1[i].Zona});	
							console.log(zona);		
							f.zona_id = zona._id;
							
							f.plan = rc.foliosArreglo.Hoja1[i].Plan;							
							f.prioridad = rc.foliosArreglo.Hoja1[i].Prioridad;													
							f.analista_id = rc.foliosArreglo.Hoja1[i].analista_id;
							
							if (rc.foliosArreglo.Hoja1[i].existe)
							{
									f.verificacionEstatus = rc.foliosArreglo.Hoja1[i].verificacionEstatus;	
									f.verificacionRazon = rc.foliosArreglo.Hoja1[i].verificacionRazon;		
							}
							else
									f.verificacionEstatus = "1";		//Pendiente
							
							f.folioEstatus = "1" 								//Por Hacer
							
							f.usuarioInserto = Meteor.userId();
							
									
							if (f.analista_id != undefined)
							{
			 					 Folios.insert(f);	
			 					 rc.foliosArreglo.Hoja1.splice(i, 1);
			 					 i--;
							}
					//}
					//else
					//{
					//		rc.foliosArreglo.Hoja1.splice(i, 1);
			 		//		i--;
					//}
					
		  }	  
		  //rc.foliosArreglo = {};
		  //toastr.success('Guardado correctamente.');

			//$state.go('root.importarfolios');

	};
		
	this.validarExistencia = function(folio){
		var existe = Folios.find(folio).count();
		if(existe == 0)
			return false;
		else
			return true;
	};
	
	this.getAnalista = function(ciudad)
	{		
			console.log(ciudad);
			var usuario = Meteor.users.findOne({"profile.ciudad":ciudad});
			if (usuario)
				 return usuario.profile.nombre;
				 
	};
	this.getAnalista_id = function(ciudad)
	{		
			var usuario = Meteor.users.findOne({"profile.ciudad":ciudad});
			if (usuario)
				 return usuario._id;
				 
	};
	
	var X = XLSX;
	
	function to_json(workbook) {
		var result = {};
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
			if(roa.length > 0){
				result[sheetName] = roa;
			}
		});
		return result;
	}
		
	function process_wb(wb) {

		var output = {};
		output = JSON.stringify(to_json(wb), 2, 2);
				
		//Validar que cuando ya exista un folio
		var folios = Folios.find().fetch();
		rc.foliosArreglo = JSON.parse(output);
		
		//console.log("todo",rc.foliosArreglo);
		_.each(rc.foliosArreglo.Hoja1, function(folioArreglo){
			//console.log("folioArreglo", folioArreglo.Analista);
			
			var	analista = Meteor.users.findOne({"username":folioArreglo.Analista});
			if (analista != undefined)
				 folioArreglo.analista_id = analista._id;		
					
			_.each(folios, function(folio){
						
				if(folio.folio == folioArreglo.Folio){
					//console.log("si");
					
					folioArreglo.verificacionEstatus = "7";					//Estatus Negativo ya estaRegistrado
					folioArreglo.verificacionRazon = folio.verificacionRazon;
					folioArreglo.existe = true;
					
				}
			})
		})
		
	}
	
	var xlf = document.getElementById('xlf');
	function handleFile(e) {
		
		var files = e.target.files;
		var f = files[0];
		{
			var reader = new FileReader();
			var name = f.name;
			reader.onload = function(e) {
				var data = e.target.result;
				var wb;
				wb = X.read(data, {type: 'binary'});
				process_wb(wb);
			};
			reader.readAsBinaryString(f);
		}
	}
	
	if(xlf.addEventListener) xlf.addEventListener('change', handleFile, false);
	
	
};



