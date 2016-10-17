Meteor.publish("folios",function(params){
  	return Folios.find(params);
});

Meteor.publish("buscarFolio",function(options){
	let selector = {
  	folio: { '$regex' : '.*' + options.where.folio || '' + '.*', '$options' : 'i' }
	}
	return Folios.find(selector, options.options);
});


Meteor.publish("buscarNombre",function(options){
	let selector = {
  	nombre: { '$regex' : '.*' + options.where.nombre || '' + '.*', '$options' : 'i' }
	}
	return Folios.find(selector, options.options);
});

