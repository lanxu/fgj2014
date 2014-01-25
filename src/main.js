// RequireJS configuration
// http://requirejs.org/docs/api.html#config
require.config({
	urlArgs: "version=" + (new Date()).getTime(),
	baseUrl: 'src/',
	paths: {
		jquery: 'libs/jquery/jquery.min',
		underscore: 'libs/underscore/underscore-min',
		backbone: 'libs/backbone/backbone-min',
		kinetic: 'libs/kinetic/kinetic',
		howler: 'libs/howler/howler.min',
		gamemodel: 'model/game_model',
		gameview: 'view/game_view',
		game: 'game',
		config: 'config',
		linemodel: 'model/line_model',
		obstaclemodel: 'model/obstacle_model'
	},
	shim: {
		//underscore: { exports: '_' },
		//backbone: { deps: ['underscore', 'jquery'], exports: 'Backbone' },
		kinetic: { exports: 'Kinetic' },
		howler: { exports: 'Howler' },
	}
});

// Run game
require(['game','jquery'], function (Game,JQuery) {
		// Run game
		Game();
	});

