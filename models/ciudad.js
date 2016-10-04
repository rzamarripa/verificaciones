Ciudad 						= new Mongo.Collection("ciudad");
Ciudad.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});