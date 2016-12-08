angular
.module("verificaciones")
.controller("DireccionAnalistasCtrl", DireccionAnalistasCtrl);
function DireccionAnalistasCtrl($scope, $meteor, $reactive,  $state, toastr) {
	
	let rc = $reactive(this).attach($scope);
	
	Window = rc;
	
	//this.buscar = {};
  //this.buscar.fechaInicial = new Date();
  //this.buscar.fechaFinal = new Date();

  this.analista_id = "";
  this.analistas_id = [];
  this.fechaInicial = new Date();
  this.fechaInicial.setHours(0,0,0,0);
  this.fechaFinal = new Date();
  this.fechaFinal.setHours(23,0,0,0);
  
  //moment.locale("es");

		
	let verf = this.subscribe('usuarios',()=>{
		return [{"profile.estatus": true, roles: ["Analista"]}]
	});
	
	this.subscribe('folios',()=>{
			return [{folioEstatus : "2", fechavisita: {$gte: rc.getReactively("fechaInicial"),$lt: rc.getReactively("fechaFinal")}}]
	});
	
	
	this.helpers({
		folios : () => {
		  	return Folios.find();
	  },
		analistas : () => {
		  if(Meteor.user()){
			  var usuarios = Meteor.users.find({roles : ["Analista"]}).fetch();
			  var analistasMR = [];
			  _.each(usuarios, function(usuario){
					  analistasMR.push(usuario);
			  });
			  rc.analistas_id = _.pluck(analistasMR, "_id");
			  
			  return analistasMR;
		  }
	  },
	  foliosVisitados : () => {
		  return Folios.find({verificacionEstatus: "3"}).count();
	  },
	  cantidadFoliosVisitadosPorAnalista : () => {
		  
		  var arreglo = [];
		  if(verf.ready()){
			  _.each(this.analistas, function(analista){
				  arreglo.push(Folios.find({verificacionEstatus: "3",
					  												analista_id : analista._id, 
					  												fechavisita: {$gte: rc.getReactively("fechaInicial"),$lt: rc.getReactively("fechaFinal")}}).count());
			  });
		  }
		  return arreglo;
	  },
	  foliosNoEncontrados : () => {
		  return Folios.find({verificacionEstatus: "4"}).count();
	  },
	  cantidadFoliosNoEncontradosPorAnalista : () => {
		  
		  var arreglo = [];
		  if(verf.ready()){
			  _.each(this.analistas, function(analista){
				  arreglo.push(Folios.find({verificacionEstatus: "4",
					  												analista_id : analista._id, 
					  												fechavisita: {$gte: rc.getReactively("fechaInicial"),$lt: rc.getReactively("fechaFinal")}}).count());
			  });
		  }
		  return arreglo;
	  },
	  foliosNoVisitados : () => {
		  return Folios.find({verificacionEstatus: "5"}).count();
	  },
	  cantidadFoliosNoVisitadosPorAnalista : () => {
		  
		  var arreglo = [];
		  if(verf.ready()){
			  _.each(this.analistas, function(analista){
				  arreglo.push(Folios.find({verificacionEstatus: "5",
					  												analista_id : analista._id, 
					  												fechavisita: {$gte: rc.getReactively("fechaInicial"),$lt: rc.getReactively("fechaFinal")}}).count());
			  });
		  }
		  return arreglo;
	  },
	  analistasNombres : () => {
		  analistasNombre = [];
		  if(verf.ready()){
			  _.each(this.analistas, function(analista){
				  var nombre = analista.profile.nombre + " " + analista.profile.apPaterno + " " + analista.profile.apMaterno;
				  analistasNombre.push(nombre);
			  });
		  }
		  return analistasNombre;
	  },
	  graficaAnalistas : () => {
		  
		  data = [];
		  
		  if(verf.ready()){
				data.push({
				  name: "Visitados",
				  data: rc.cantidadFoliosVisitadosPorAnalista
				});
				
				data.push({
					name: "No Encontrados",
					data: rc.cantidadFoliosNoEncontradosPorAnalista
				});

				data.push({
					name: "No Visitados",
					data: rc.cantidadFoliosNoVisitadosPorAnalista
				});

			}
			$('#container').highcharts( {
			    chart: { type: 'column' },
			    title: { text: 'Resumen de Folios Por Analista' },
			    subtitle: {
		        text: 'Del ' + moment(this.getReactively("fechaInicial")).format('LL') + 
		        			' al ' + moment(this.getReactively("fechaFinal")).format('LL')
			    },
			    xAxis: {
		        categories: rc.analistasNombres,
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
	
	//Validar si tiene foto 
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
  
  //Cantidad de folios Visitados por Analista
  this.getCantidadVisitadosAnalista = function(id){
	  return Folios.find({verificacionEstatus: "3",
		  									analista_id : id }).count();
  };
  
  //Cantidad de folios No Encontrados por Analista
  this.getCantidadNoEncontradosAnalista = function(id){
	  return Folios.find({verificacionEstatus: "4",
		  									analista_id : id }).count();
  };
  
  //Cantidad de folios No Visitados por Analista
  this.getCantidadNoVisitadosAnalista = function(id){
	  return Folios.find({verificacionEstatus: "5",
		  									analista_id : id }).count();
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