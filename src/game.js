/**
 * Main game javascript
 * Requires:
 * - all game related models and views
 * Contains:
 * - Mainloop
 */
define(['backbone','kinetic','howler','jquery','gamemodel','gameview'], function (Backbone, Kinetic, Howler, JQuery,GameModel, GameView) {


var keyStates = [];
function onKeyDown(evt){
	keyStates[evt.keyCode] = true;
}

function onKeyUp(evt){
	keyStates[evt.keyCode] = false;
}
/*function onMouseMove(evt){
}*/


window.addEventListener('keydown', onKeyDown, true);
window.addEventListener('keyup', onKeyUp, true);

//window.addEventListener('mousemove', onMouseMove, false);
	var test = function() {
		var FPS = 1000/30;
		console.log('Game started');
		var game_doc = Backbone.Collection.extend({ model: GameModel });
		var game_model = new GameModel;
		var game_view = new GameView({ el: '#container', model: game_model });

		console.log('Render');
		game_view.render();

		//var sound = new Howl({
		//  urls: ['web/sounds/Electro_House_Loop.ogg'],
		//  loop: true,
		//  volume: 0.5,
		//  }).play();
	
		var play_sound = true;
		var x = 0;
		var leftover = 0;

		game_view.layer.on('mousemove', function() {
			console.log('move');
		});
		var gameLayerLoop = new Kinetic.Animation(function(frame) {
			// How many logic updates needs to be done to keep up 
			// with the target FPS?
			//
			// Current implementation problem: samples 
			// frame-by-frame which is not good (a bit jerky)
			// A more sophisticated version required with 
			// fps "planning" for number of updates

			var numUpdates = Math.floor((frame.timeDiff + leftover) / FPS);
			for(var i = 0; i < numUpdates; i++) {
			
				game_model.myLineModel.addPoint(Math.cos(x*(180/Math.PI)),Math.sin(x*(180/Math.PI)));
				
				game_model.myLine.attrs.points = game_model.myLineModel.getPoints();
				
				game_model.myLineModel.movePoints();
				
				// Logic
				// Modify model -> see difference
				if(game_model.myRect != null) {
					game_model.myRect.setX(x);
					game_model.myRect.setY(10+Math.random()*5);
				x+=2;
				
				
				}
							
				if(game_model.myImg != null) {
					game_model.myImg.setX(352+Math.random()*5);
					game_model.myImg.setY(152+Math.random()*5);
					//console.log(keyStates);
				}
					// If Samsung android browser is detected
/*					if (window.navigator && window.navigator.userAgent.indexOf('534.30') > 0) {

					// Tweak the canvas opacity, causing it to redraw
					$('canvas').css('opacity', '0.99');

					// Set the canvas opacity back to normal after 5ms
					setTimeout(function() {
						$('canvas').css('opacity', '1');
					}, 5);

				}
*/

			}
			/*
			if(keyStates.length > 0) {
				play_sound = false;
			} else {
				play_sound = true;
			}

			if(play_sound === true) {
				sound.play();
			}*/
			leftover = leftover + (frame.timeDiff - numUpdates*FPS);
		}, game_view.layer);
			
		gameLayerLoop.start();
	
		console.log(game_model);

	};

	return test;
});
