angular
.module("verificaciones")
.controller("DireccionFoliosCtrl", DireccionFoliosCtrl);
function DireccionFoliosCtrl($scope, $meteor, $reactive,  $state, toastr) {
	
	let rc = $reactive(this).attach($scope);
	
	Window = rc;
	
	//this.buscar = {};
  //this.buscar.fechaInicial = new Date();
  //this.buscar.fechaFinal = new Date();

  this.verificador_id = "";
  this.verificadores_id = [];
  this.fechaInicial = new Date();
	this.fechaInicial.setHours(0,0,0,0);
  this.fechaFinal = new Date();
  this.fechaFinal.setHours(23,0,0,0);
  
  //moment.locale("es");

		
	let verf = this.subscribe('usuarios',()=>{
		return [{"profile.estatus": true, roles: ["Verificador"]}]
	});
	
	this.subscribe('folios',()=>{
			return [{folioEstatus : "2", fechavisita: {$gte: rc.getReactively("fechaInicial"),$lt: rc.getReactively("fechaFinal")}}]
	});
	
	
	this.helpers({
		folios : () => {
		  	return Folios.find();
	  },
		verificadores : () => {
		  if(Meteor.user()){
			  var usuarios = Meteor.users.find({roles : ["Verificador"]}).fetch();
			  var verificadoresMR = [];
			  _.each(usuarios, function(usuario){
					  verificadoresMR.push(usuario);
			  });
			  rc.verificadores_id = _.pluck(verificadoresMR, "_id");
			  
			  return verificadoresMR;
		  }
	  },
	  foliosVisitados : () => {
		  return Folios.find({verificacionEstatus: "3"}).count();
	  },
	  cantidadFoliosVisitadosPorVerificador : () => {
		  
		  var arreglo = [];
		  if(verf.ready()){
			  _.each(this.verificadores, function(verificador){
				  arreglo.push(Folios.find({verificacionEstatus: "3",
					  												verificador_id : verificador._id, 
					  												fechavisita: {$gte: rc.getReactively("fechaInicial"),$lt: rc.getReactively("fechaFinal")}}).count());
			  });
		  }
		  return arreglo;
	  },
	  foliosNoEncontrados : () => {
		  return Folios.find({verificacionEstatus: "4"}).count();
	  },
	  cantidadFoliosNoEncontradosPorVerificador : () => {
		  
		  var arreglo = [];
		  if(verf.ready()){
			  _.each(this.verificadores, function(verificador){
				  arreglo.push(Folios.find({verificacionEstatus: "4",
					  												verificador_id : verificador._id, 
					  												fechavisita: {$gte: rc.getReactively("fechaInicial"),$lt: rc.getReactively("fechaFinal")}}).count());
			  });
		  }
		  return arreglo;
	  },
	  foliosNoVisitados : () => {
		  return Folios.find({verificacionEstatus: "5"}).count();
	  },
	  cantidadFoliosNoVisitadosPorVerificador : () => {
		  
		  var arreglo = [];
		  if(verf.ready()){
			  _.each(this.verificadores, function(verificador){
				  arreglo.push(Folios.find({verificacionEstatus: "5",
					  												verificador_id : verificador._id, 
					  												fechavisita: {$gte: rc.getReactively("fechaInicial"),$lt: rc.getReactively("fechaFinal")}}).count());
			  });
		  }
		  return arreglo;
	  },
	  verificadoresNombres : () => {
		  verificadoresNombre = [];
		  if(verf.ready()){
			  _.each(this.verificadores, function(verificador){
				  var nombre = verificador.profile.nombre + " " + verificador.profile.apPaterno + " " + verificador.profile.apMaterno;
				  verificadoresNombre.push(nombre);
			  });
		  }
		  return verificadoresNombre;
	  },
	  graficaVerificadores : () => {
		  
		  data = [];
		  
		  if(verf.ready()){
				data.push({
				  name: "Visitados",
				  data: rc.cantidadFoliosVisitadosPorVerificador
				});
				
				data.push({
					name: "No Encontrados",
					data: rc.cantidadFoliosNoEncontradosPorVerificador
				});

				data.push({
					name: "No Visitados",
					data: rc.cantidadFoliosNoVisitadosPorVerificador
				});
				
			}
			$('#container').highcharts( {
			    chart: { type: 'column' },
			    title: { text: 'Resumen de Folios Por Verificador' },
			    subtitle: {
		        text: 'Del ' + moment(this.getReactively("fechaInicial")).format('LL') + 
		        			' al ' + moment(this.getReactively("fechaFinal")).format('LL')
			    },
			    xAxis: {
		        categories: rc.verificadoresNombres,
		        crosshair: true
			    },
			    yAxis: {
		        min: 0,
		        title: {
		          text: 'Folios'
		        }
			    },
			    tooltip: {
		        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
		        pointFormat:  '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
		            					'<td style="color:{series.color};padding:0"><b>{point.y:.0f} </b></td></tr>',
		        footerFormat: '</table>',
		        shared: true,
		        useHTML: true
			    },
			    plotOptions: {
		        column: {
		          pointPadding: 0.2,
		          borderWidth: 0
		        }
			    },
			    series: data
				}
			);
			return data;
	  }
	});
	
	//Validar si tiene foto el vendedor
  this.tieneFoto = function(sexo, foto){
	  if(foto === undefined){
		  if(sexo === "masculino")
			  return "img/badmenprofile.jpeg";
			else if(sexo === "femenino"){
				return "img/badgirlprofile.jpeg";
			}else{
				return "img/badprofile.jpeg";
			}
	  }else{
		  return foto;
	  }
  };

	//Buscar prospectos entre fechas
  /*
  this.buscarFolios = function(buscar){
	  console.log(this.fechaInicial);
	  this.fechaInicial.setHours(0,0,0,0);
	  
	  
	  console.log(this.fechaInicial);
	  console.log(buscar);
	  rc.fechaInicial = buscar.fechaInicial.setHours(0);
	  rc.fechaFinal = buscar.fechaFinal.setHours(24);
  }
	*/

};