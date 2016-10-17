Meteor.publish("zona",function(params){
  	return Zona.find(params);
});