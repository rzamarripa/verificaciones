Meteor.publish("folios",function(params){
  	return Folios.find(params);
});

Meteor.publish("foliosPanel",function(params){
  	return Folios.find(params, {fields: { _id:1
	  																		 ,folio:1
	  																		 ,nombre:1
	  																		 ,fecha:1
	  																		 ,zona_id:1
	  																		 ,plan:1
	  																		 ,prioridad:1
	  																		 ,analista_id:1
	  																		 ,verificador_id:1
	  																		 ,domicilio:1
	  																		 ,telefono:1
	  																		 ,ubicacion:1
	  																		 ,razon:1
	  																		 ,verificacionRazon:1
	  																		 ,verificacionEstatus:1
	  																		 ,folioEstatus:1
	  																		 ,referencia:1
	  																		 ,EsLlamado:1
	  																		 }});
});




Meteor.publish("buscarFolio",function(options){
	let selector = {
  	folio: { '$regex' : '.*' + options.where.folio || '' + '.*', '$options' : 'i' }
	}
	return Folios.find(selector, {fields: { _id:1
	  																		 ,folio:1
	  																		 ,nombre:1
	  																		 ,fecha:1
	  																		 ,zona_id:1
	  																		 ,plan:1
	  																		 ,prioridad:1
	  																		 ,analista_id:1
	  																		 ,verificador_id:1
	  																		 ,domicilio:1
	  																		 ,telefono:1
	  																		 ,ubicacion:1
	  																		 ,razon:1
	  																		 ,verificacionRazon:1
	  																		 ,verificacionEstatus:1
	  																		 ,folioEstatus:1
	  																		 ,referencia:1
	  																		 }},options.options);
});


Meteor.publish("buscarNombre",function(options){
	let selector = {
  	nombre: { '$regex' : '.*' + options.where.nombre || '' + '.*', '$options' : 'i' }
	}
	return Folios.find(selector, {fields: { _id:1
	  																		 ,folio:1
	  																		 ,nombre:1
	  																		 ,fecha:1
	  																		 ,zona_id:1
	  																		 ,plan:1
	  																		 ,prioridad:1
	  																		 ,analista_id:1
	  																		 ,verificador_id:1
	  																		 ,domicilio:1
	  																		 ,telefono:1
	  																		 ,ubicacion:1
	  																		 ,razon:1
	  																		 ,verificacionRazon:1
	  																		 ,verificacionEstatus:1
	  																		 ,folioEstatus:1
	  																		 ,referencia:1
	  																		 }},options.options);
});

