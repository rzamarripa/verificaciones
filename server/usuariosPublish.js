<<<<<<< HEAD
Meteor.publish("usuarios",function(params){
  	return Meteor.users.find(params);
});

Meteor.publish("logistica", function(){
	return Roles.getUsersInRole( ['Analista','Verificador']);
=======
Meteor.publish("gerentesVenta", function(){
	return Roles.getUsersInRole( 'gerenteVenta');
});

Meteor.publish("usuarios", function(options){
	return  Meteor.users.find(options);
});

Meteor.publish("coordinadores", function(){
	return Roles.getUsersInRole( ['coordinadorAcademico', 'coordinadorFinanciero'] );
>>>>>>> d14e81896fe95af1675ce3c8b00c708eb3b5be37
});