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
		var selectPoint = 199;

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
				hzPoints = [];
				for(var j = 0; j < game_model.myLineModel.length; j++) {
					game_model.myLineModel[j].addPoint(j*5-7.5,Math.sin(x*(Math.PI/180))+2.5);
					
					game_model.myLine[j].attrs.points = game_model.myLineModel[j].getPoints();
					
					game_model.myLineModel[j].movePoints();
					curPoint = game_model.myLineModel[j].getPoint(selectPoint);
					if(curPoint !== null) {
						hzPoints.push(curPoint[0]);
						hzPoints.push(curPoint[1]);
					}
				}
				game_model.myHzLine.attrs.points = hzPoints;
				// Logic
				// Modify model -> see difference
				if(game_model.myRect != null) {
					game_model.myRect.setX(x);
					game_model.myRect.setY(10+Math.random()*5);
					x+=2;
					selectPoint-=1;
					if(selectPoint < 0) {
						selectPoint = 199;
					}
				}
							
				if(game_model.myImg != null) {
					//var imgPoint = game_model.myLineModel[1].getPoint(selectPoint);
					selectPoint = 100;
					var imgPoint = game_model.myLineModel[1].getPoint(selectPoint);
					if(imgPoint !== null) {
						var scaling_factor = (((200-selectPoint)*0.005)+0.1);	
						game_model.myImg.setX(imgPoint[0]-scaling_factor*40);
						game_model.myImg.setY(imgPoint[1]-scaling_factor*100);
						game_model.myImg.scaleX(scaling_factor);
						game_model.myImg.scaleY(scaling_factor);

					}
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
