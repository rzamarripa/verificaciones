Meteor.methods({
  createUsuario: function (usuario, rol) {
<<<<<<< HEAD
	 			var usuario_id = Accounts.createUser({
					username: usuario.username,
					password: usuario.password,			
					profile: usuario.profile
=======
	  profile = {
				email: usuario.correo,
				nombre: usuario.nombre,
				apellidos: usuario.apPaterno + " " + usuario.apMaterno,
				nombreCompleto : usuario.nombre  + " " + usuario.apPaterno + " " + (usuario.apMaterno ? usuario.apMaterno : ""),
				fotografia : usuario.fotografia,
				estatus:true,
				campus_id : usuario.campus_id,
				seccion_id : usuario.seccion_id
			}
		if(usuario.maestro_id != undefined)
			profile.maestro_id = usuario.maestro_id;
		
		var usuario_id = Accounts.createUser({
			username: usuario.nombreUsuario,
			password: usuario.contrasena,			
			profile: profile
>>>>>>> d14e81896fe95af1675ce3c8b00c708eb3b5be37
		});
		
		Roles.addUsersToRoles(usuario_id, rol);
		
	},
	userIsInRole: function(usuario, rol, grupo, vista){
		if (!Roles.userIsInRole(usuario, rol, grupo)) {
	    throw new Meteor.Error(403, "Usted no tiene permiso para entrar a " + vista);
	  }
	},
	updateUsuario: function (usuario, rol) {		
	  var user = Meteor.users.findOne({"_id" : usuario._id});
	  Meteor.users.update({_id: user._id}, {$set:{
			username: usuario.username,
			password: usuario.password,
			roles: [rol],
			profile: usuario.profile
		}});
		Accounts.setPassword(usuario._id, usuario.password, {logout: false});
	}
});