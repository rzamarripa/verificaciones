Meteor.publish("folios",function(params){
  	return Folios.find(params);
});