/**
 * Main game javascript
 * Requires:
 * - all game related models and views
 * Contains:
 * - Mainloop
 */
define(['backbone','kinetic','howler','jquery','gamemodel','gameview','linemodel', 'obstaclemodel'], function (Backbone, Kinetic, Howler, JQuery,GameModel, GameView,LineModel, ObstacleModel) {


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
		game_view.render(function() {

			//var sound = new Howl({
			//  urls: ['web/sounds/Electro_House_Loop.ogg'],
			//  loop: true,
			//  volume: 0.5,
			//  }).play();

			var play_sound = true;
			var x = 0;
			var leftover = 0;
			var selectPoint = 199;
			var moving = false;
			var movingtoline = 0;
			var playerspeedx = 0;
			var playerspeedy = 0;
			var movespeedx = 0;
			var movespeedy = 0;

			var numObstacles = 4;
			var obstacle = [];
			var curObstacleLine = [];
			
			var targetx = 0;
			var targety = 0;
			var bgMusicState = false;
			var bgMusic = null;

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
						//console.log(game_model.myLineModel[j].getPoints());

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
					x+=2;
					selectPoint-=1;
					if(selectPoint < 0) {
						selectPoint = 199;
					}

					// Stars
					for(var i = 0; i < 100; i++) {
						game_model.starsPosition[i*3+2] -= game_model.starsVelocity[i];
						game_model.stars[i].setX(game_model.starsPosition[i*3]/game_model.starsPosition[i*3+2] * 100 + game_model.width/2);
						game_model.stars[i].setY(game_model.starsPosition[i*3+1]/game_model.starsPosition[i*3+2] * 100 + game_model.height/2);
						if(game_model.stars[i].getX() < 0 || game_model.stars[i].getX() > game_model.width ||game_model.stars[i].getY() < 0 || game_model.stars[i].getY() > game_model.height || game_model.starsPosition[i*3+2] < 1) {
							game_model.starsPosition[i*3] = Math.random()*1000-500;
							game_model.starsPosition[i*3+1] =  Math.random()*1000-500;
							game_model.starsPosition[i*3+2] = Math.random()*900+100;					
						}
						//b = ( (255/5) * star_zv(i)) * (1000 / starz[i])	
						var b = ( game_model.starsVelocity[i] * (1000 / game_model.starsPosition[i*3+2] ) );
						game_model.stars[i].setScaleX(b/200);
						game_model.stars[i].setScaleY(b/200);
					}	

					if(moving === false) {

						if(game_model.myImg != null) {
							//var imgPoint = game_model.myLineModel[1].getPoint(selectPoint);
							selectPoint = 120;
							var imgPoint = game_model.myLineModel[game_model.currentLine].getPoint(selectPoint);
							if(imgPoint !== null) {
								if(bgMusicState === false) {
									bgMusic = new Howl({
										urls: ['web/sounds/fgj2014_running.ogg'],
										loop: true,
										volume: 0.5,
									}).play();
									bgMusicState = true;
								}
								var scaling_factor = (((200-selectPoint)*0.005)+0.1);	
								var rotation_angle = -game_model.myLineModel[game_model.currentLine].getPointDiffAngle(selectPoint)*(180/Math.PI)*0.5;
								if(game_model.currentLine > 1) {
									//game_model.myImg.setScaleX(-game_model.myImg.getScaleX());
									game_model.myImg.setX(imgPoint[0]+scaling_factor*30);
									game_model.myImg.setY(imgPoint[1]-scaling_factor*105);
									game_model.myImg.scaleX(-scaling_factor);
								} else {
									game_model.myImg.setX(imgPoint[0]-scaling_factor*30);
									game_model.myImg.setY(imgPoint[1]-scaling_factor*105);
									game_model.myImg.scaleX(scaling_factor);
								}
								//game_model.myImg.rotation(rotation_angle);
								game_model.myImg.scaleY(scaling_factor);


							}
						}


						if(keyStates[37] === true) {
							console.log('left');
							if(game_model.currentLine > 0) {
								moving = true;
								playerspeedy = -15;
								movingtoline = game_model.currentLine--;
						/*		movespeedx = Math.abs(targetx - game_model.myImg.getX())/60;
								movespeedy = Math.abs(targety - game_model.myImg.getY())/60;*/
								var imgPoint = game_model.myLineModel[game_model.currentLine].getPoint(150);
								if(imgPoint !== null) {

									var scaling_factor = (((200-120)*0.005)+0.1);	
									var angle = game_model.myLineModel[game_model.currentLine].getPointAngle(150);

									targetx = imgPoint[0]+Math.sin(angle)*3*30-scaling_factor*30;
									targety = imgPoint[1]+Math.cos(angle)*3*30-scaling_factor*105;

									movespeedx = Math.abs(targetx - game_model.myImg.getX())/30;
									movespeedy = Math.abs(targety - game_model.myImg.getY())/30;
								}

							}
						}
						if(keyStates[38] === true) {
							console.log('up');
						}
						if(keyStates[39] === true) {
							console.log('right');
							if(game_model.currentLine <3) {
								moving = true;
								playerspeedy = -15;
								movingtoline = game_model.currentLine+1;
								game_model.currentLine++;

								var imgPoint = game_model.myLineModel[game_model.currentLine].getPoint(150);
								if(imgPoint !== null) {
									var scaling_factor = (((200-120)*0.005)+0.1);	
									var angle = game_model.myLineModel[game_model.currentLine].getPointAngle(150);
									targetx = imgPoint[0]+Math.sin(angle)*3*30-scaling_factor*30;
									targety = imgPoint[1]+Math.cos(angle)*3*30-scaling_factor*105;


									movespeedx = Math.abs(targetx - game_model.myImg.getX())/30;
									movespeedy = Math.abs(targety - game_model.myImg.getY())/30;
								}
							}
						}
						if(keyStates[40] === true) {
							console.log('down');
						}

					} else {
						// Animation in progress!

						if(targetx < game_model.myImg.getX()) {
							playerspeedx =-movespeedx;
						}
						if(targetx > game_model.myImg.getX()) {
							playerspeedx = movespeedx; 
						}
						if(targety < game_model.myImg.getY()) {
							playerspeedy = -movespeedy;
						}
						if(targety > game_model.myImg.getY()) {
							playerspeedy = movespeedy;
						}

						game_model.myImg.setX( game_model.myImg.getX()+playerspeedx);
						game_model.myImg.setY( game_model.myImg.getY()+playerspeedy);

						/*
						   var scaling_factor = (((200-selectPoint)*0.005)+0.1);
						   var targetx = 0;
						   var targety = 0;
						   var targets = 1;
						   if(game_model.currentLine > 1) {
						//game_model.myImg.setScaleX(-game_model.myImg.getScaleX());
						targetx = (imgPoint[0]+scaling_factor*20);
						targety = (imgPoint[1]-scaling_factor*110);
						game_model.myImg.scaleX(-scaling_factor);
						} else {
						targetx = (imgPoint[0]-scaling_factor*40);
						targety = (imgPoint[1]-scaling_factor*100);
						game_model.myImg.scaleX(scaling_factor);
						}
						//game_model.myImg.rotation(rotation_angle);
						game_model.myImg.scaleY(scaling_factor);

						var acc = 0.4;
						var dx = Math.abs(targetx - game_model.myImg.getX())/5;
						var dy = Math.abs(targety - game_model.myImg.getY())/5;
						//var dy = 1;
						if(targetx < game_model.myImg.getX()) {
						playerspeedx =-1 - acc * dx;
						}
						if(targetx > game_model.myImg.getX()) {
						playerspeedx = 1 + acc * dx; 
						}
						if(targety < game_model.myImg.getY()) {
						playerspeedy -= acc * dy;
						}
						if(targety > game_model.myImg.getY()) {
						playerspeedy += acc * dy;
						}
						// limit
						*/
						/*	if(playerspeedx > 5) playerspeedx = 5;
							if(playerspeedx < -5) playerspeedx = -5;
							if(playerspeedy > 5) playerspeedy = 5;
							if(playerspeedy < -5) playerspeedy = -5;
							*/

						if( Math.abs(game_model.myImg.getX() - targetx) <= 10 &&
								Math.abs(game_model.myImg.getY() - targety) <= 10) {
									moving = false;
								}

					}
					if(game_model.myLineModel[0].getPoint(190) !== null && obstacle[0] === undefined)
					{
						obstacle[0] = new ObstacleModel(game_model.sprites[5], game_model.myLineModel[0], -1,100);
						obstacle[1] = new ObstacleModel(game_model.sprites[6], game_model.myLineModel[1], -1,100);
						obstacle[2] = new ObstacleModel(game_model.sprites[7], game_model.myLineModel[2], -1,100);
						obstacle[3] = new ObstacleModel(game_model.sprites[8], game_model.myLineModel[3], -1,100);
					}

					for(var j=0;j<numObstacles;j++) {
						if(obstacle[j] !== undefined) {
							obstacle[j].updatePosition();

							if(obstacle[j].getCurrentPoint() < 40) {
								var obsLine = Math.floor((Math.random()*4));
								curObstacleLine[j] = obsLine;
								obstacle[j] = new ObstacleModel(game_model.sprites[j+5], game_model.myLineModel[obsLine], -(Math.random()*2+0.5),195);
							}

							oPos = obstacle[j].getCurrentPoint();

							if(oPos < selectPoint+5 && oPos > selectPoint-5 && curObstacleLine[j] === game_model.currentLine) {
								console.log("Collision in line "+curObstacleLine.toString());
							}
						}
					}


					// Check if player has collided with an object


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


		});


	};

	return test;
});
