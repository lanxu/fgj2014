define(['config', 'backbone'], function (Config, Backbone) {

	var Config = Backbone.Model.extend({
		defaults: {
			'windowWidth' : 1280,
			'windowHeight' : 720,
		},
		initialize: function() {
		       
		},    
	});

	return Config;
});
