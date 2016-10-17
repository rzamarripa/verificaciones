Zona 						= new Mongo.Collection("zona");
Zona.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});