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
			var health = 0;
			var numObstacles = 4;
			var obstacle = [];
			var curObstacleLine = [];
			var collisionTimer = 90;
			var collisionState = false;
			var targetx = 0;
			var targety = 0;
			var bgMusicState = false;
			var bgMusic = null;

			var allup = false;
			var lives = 3;
			var bgScale = 1;
			var endGameState = false;

			// State machine variables
			var startGameState = 0;
			var gameOverState = 1;
			var inGameState = 2;
			var goinState = 3;
			var changeLevelState = 4;
			var initState = 5;
			var state = initState;
			var healthUpTimer = 150;
			var currentMood = 1;
			var bounceSound = new Howl({
				urls: ['web/sounds/bounce.wav'],
			    loop: false,
			    volume: 0.5,
			});
			var windupSound = new Howl({
				urls: ['web/sounds/windup.ogg'],
			    loop: false,
			    volume: 0.3,
			});
			
			var crashSound = new Howl({
				urls: ['web/sounds/crash.ogg'],
			    loop: false,
			    volume: 0.6,
			});
			
				bgMusic = new Howl({
					urls: ['web/sounds/fgj2014_running.ogg'],
					loop: true,
					volume: 0.3,
				});

			
			var surfTimer = 0;
			var surfEnable = false;
			var betweenLines = false;
			var betweenLinesCounter = 20;
			var moveTimer = 30;

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
					if(state === initState) {
						health = 0.5;
						// Update health
						game_model.myHBFill.width(health*144);
						game_model.myHB.setVisible(false);
						surfEnable = true;
						surfTimer = 0;
						endGameState = false;
						collisionState = false;
						x = 0;
						lives = 3;
						moveTimer = 30;
						game_model.myHBFill.setVisible(false);
						game_model.myHBText.setVisible(false);
						game_model.myLivesText.setVisible(false);
						game_model.title.setVisible(true);
						game_model.title_extreme.setVisible(true);
						game_model.startText.setVisible(true);
						game_model.mySurfText.setVisible(false);
						game_model.mySurfText.setX(500);
						game_model.mySurfText.setY(10);
						game_model.mySurfText.text('Surf Time: ' + Math.floor(surfTimer/30) + ' s');
						for(var i = 0; i < 3; i++) {
							game_model.liveImgs[i].setVisible(false);
						}
						game_model.currentLine = 0;
						for(var j = 0; j < game_model.myLineModel.length; j++) {
							game_model.myLineModel[j].clear();
						}
						for(var j=0;j<numObstacles;j++) {

							if(obstacle[j] !== undefined) {
								obstacle[j].clear();
							}
						}
						game_model.sprites[5].setX(-200);
						game_model.sprites[6].setX(-200);
						game_model.sprites[7].setX(-200);
						game_model.sprites[8].setX(-200);
						game_model.sprites[9].scaleX(1);
					game_model.sprites[9].scaleY(1);
					game_model.sprites[9].setX(game_model.width/2-75);
					game_model.sprites[9].setY(game_model.height/2+75);
						game_view.bglayer.draw();
						state = startGameState;

					} else if(state === startGameState) {
						// initialize
						keyStates.forEach(function(value) {
							if(value && allup) {
								game_model.myHB.setVisible(true);
								game_model.myHBFill.setVisible(true);
								game_model.myHBText.setVisible(true);
								game_model.myLivesText.setVisible(false);
								game_model.title.setVisible(false);
								game_model.title_extreme.setVisible(false);
								game_model.startText.setVisible(false);
								game_model.mySurfText.setVisible(true);
								for(var i = 0; i < 3; i++) {
									game_model.liveImgs[i].setVisible(true);
								}

								game_view.bglayer.draw();

								game_model.spriteSheet.setX(game_model.width/2+100);	
								game_model.spriteSheet.setY(-200);
								game_model.spriteSheet.scaleY(3);
								game_model.spriteSheet.scaleX(3);
								game_model.spriteSheet.animation('jump');
								game_model.spriteSheet.setVisible(true);


								// Target

								game_model.spriteSheet.tween = new Kinetic.Tween({
									node: game_model.spriteSheet,
									x: 170,
									y: 315,
									scaleX: 0.5,
									scaleY: 0.5,
									easing: Kinetic.Easings.EaseOut,
									duration: 7

								});
								game_model.spriteSheet.tween.play();
								game_model.backgrounds[0].tween = new Kinetic.Tween({
									node: game_model.backgrounds[0],
									//x: -170,
									//y: -315,
									//scaleX: 0.5,
									//scaleY: 0.5,
									opacity:0,
									easing: Kinetic.Easings.EaseInOut,
									duration: 7

								});
								game_model.backgrounds[0].tween.play();
								currentMood = 1;
								state = goinState;
								windupSound.play();
							}

						});		
						//state = inGameState;

						allup = true;
						keyStates.forEach(function(value) {
							if(value) {
								allup = false;
							}
						});


					} else if(state === goinState) {
						for(var j = 0; j < game_model.myLineModel.length; j++) {
							if( j === game_model.currentLine) {
								game_model.myLine[j].stroke('red');
							} else {
								game_model.myLine[j].stroke('white');
							}
							game_model.myLineModel[j].addPoint(j*5-7.5,Math.sin((x+j*80)*(Math.PI/180))+2.5);
							//console.log(game_model.myLineModel[j].getPoints());

							game_model.myLine[j].attrs.points = game_model.myLineModel[j].getPoints();

							game_model.myLineModel[j].movePoints();
							/*curPoint = game_model.myLineModel[j].getPoint(selectPoint);
							  if(curPoint !== null) {
							  hzPoints.push(curPoint[0]);
							  hzPoints.push(curPoint[1]);
							  }*/

						}

						x++;
						if(x > 200) {
							state = inGameState;
							windupSound.stop();
							bgMusic.play();
						}



					} else if(state === inGameState) {



						if(betweenLines === true) {
							betweenLinesCounter--;
							if(betweenLinesCounter <= 0) {
								betweenLines = false;
								betweenLinesCounter = 20;
							}
						}

						healthUpTimer -= 1;

						if(healthUpTimer <= 0 && endGameState === false) {
							health += 0.05;
							if(health > 1) {
								health = 1;
							}
							healthUpTimer = 150;
							if(health >= 0.5 && currentMood == 0) {

								game_model.backgrounds[0].tween = new Kinetic.Tween({
									node: game_model.backgrounds[0],
									//x: -170,
									//y: -315,
									//scaleX: 0.5,
									//scaleY: 0.5,
									opacity:0,
									easing: Kinetic.Easings.EaseInOut,
									duration: 7

								});
								game_model.backgrounds[0].tween.play();
								currentMood = 1;
							}
							if(health >= 0.75 && currentMood == 1) {

								game_model.backgrounds[1].tween = new Kinetic.Tween({
									node: game_model.backgrounds[1],
									//x: -170,
									//y: -315,
									//scaleX: 0.5,
									//scaleY: 0.5,
									opacity:0,
									easing: Kinetic.Easings.EaseInOut,
									duration: 7

								});
								game_model.backgrounds[1].tween.play();
								currentMood = 2;
							}


						}

						if(surfEnable === true && endGameState === false) {
							surfTimer += 1;
						}
						game_model.mySurfText.text('Surf Time: ' + Math.floor(surfTimer/30) + ' s');

						// Update health
						game_model.myHBFill.width(health*144);

						bgScale+=0.001;
						game_model.sprites[9].setScaleX(bgScale);
						game_model.sprites[9].setScaleY(bgScale);
						game_model.sprites[9].setY(game_model.sprites[9].getY()-0.1*bgScale);
						game_model.sprites[9].setX(game_model.width/2-75*bgScale);
						//game_view.bglayer.draw();
						/*							for(var h = 0; h < 3; h++) {
													game_model.backgrounds[h].setX(-0.1*bgScale);
													game_view.bglayer.draw();
													}*/

						hzPoints = [];
						for(var j = 0; j < game_model.myLineModel.length; j++) {
							if( j === game_model.currentLine && betweenLines === false) {
								game_model.myLine[j].stroke('red');
							} else {
								game_model.myLine[j].stroke('white');

							}
							game_model.myLineModel[j].addPoint(j*5-7.5,Math.sin((x+j*80)*(Math.PI/180))+2.5);
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
						x +=2;

						if(moving === false) {

							game_model.spriteSheet.animation('idle');
							if(game_model.myImg != null) {
								//var imgPoint = game_model.myLineModel[1].getPoint(selectPoint);
								if(endGameState === false) {
									selectPoint = 120;
								} else {
									selectPoint += 1;
									if(selectPoint > 199) {
										state = gameOverState;
									}
								}
								var imgPoint = game_model.myLineModel[game_model.currentLine].getPoint(selectPoint);
								if(imgPoint !== null) {

									var scaling_factor = (((200-selectPoint)*0.005)+0.1);	
									var rotation_angle = -game_model.myLineModel[game_model.currentLine].getPointDiffAngle(selectPoint)*(180/Math.PI)*0.5;
									if(game_model.currentLine > 1) {
										game_model.spriteSheet.scaleX(-scaling_factor);
									} else {
										game_model.spriteSheet.scaleX(scaling_factor);
									}
									//game_model.spriteSheet.rotation(rotation_angle+15);
									game_model.spriteSheet.scaleY(scaling_factor);
									game_model.spriteSheet.setX(imgPoint[0]-scaling_factor);
									game_model.spriteSheet.setY(imgPoint[1]-scaling_factor*52);


								}

							}


							if(keyStates[37] === true) {
								console.log('left');
								if(game_model.currentLine > 0) {
									moving = true;
									playerspeedy = -15;
									movingtoline = game_model.currentLine--;
									var imgPoint = game_model.myLineModel[game_model.currentLine].getPoint(150);
									if(imgPoint !== null) {

										var scaling_factor = (((200-120)*0.005)+0.1);	
										var angle = game_model.myLineModel[game_model.currentLine].getPointAngle(150);

										targetx = imgPoint[0]+Math.sin(angle)*3*30-scaling_factor*30;
										targety = imgPoint[1]+Math.cos(angle)*3*30-scaling_factor*105;

										movespeedx = Math.abs(targetx - game_model.spriteSheet.getX())/30;
										movespeedy = Math.abs(targety - game_model.spriteSheet.getY())/30;
									}
									betweenLines = true;
									bounceSound.play();

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


										movespeedx = Math.abs(targetx - game_model.spriteSheet.getX())/30;
										movespeedy = Math.abs(targety - game_model.spriteSheet.getY())/30;
									}
									betweenLines = true;
									bounceSound.play();
								}
							}
							if(keyStates[40] === true) {
								console.log('down');
							}

						} else {
							// Animation in progress!
							game_model.spriteSheet.animation('jump');
							if(targetx < game_model.spriteSheet.getX()) {
								playerspeedx =-movespeedx;
							}
							if(targetx > game_model.spriteSheet.getX()) {
								playerspeedx = movespeedx; 
							}
							if(targety < game_model.spriteSheet.getY()) {
								playerspeedy = -movespeedy;
							}
							if(targety > game_model.spriteSheet.getY()) {
								playerspeedy = movespeedy;
							}

							game_model.spriteSheet.setX( game_model.spriteSheet.getX()+playerspeedx);
							game_model.spriteSheet.setY( game_model.spriteSheet.getY()+playerspeedy);
							if( moveTimer <= 0) {
								moving = false;
								moveTimer = 30;
							} else {
								moveTimer -= 1;
							}

						}
						if(game_model.myLineModel[0].getPoint(190) !== null && obstacle[0] === undefined)
						{
							obstacle[0] = new ObstacleModel(game_model.sprites[5], game_model.myLineModel[0], -1,10);
							obstacle[1] = new ObstacleModel(game_model.sprites[6], game_model.myLineModel[1], -1,10);
							obstacle[2] = new ObstacleModel(game_model.sprites[7], game_model.myLineModel[2], -1,10);
							obstacle[3] = new ObstacleModel(game_model.sprites[8], game_model.myLineModel[3], -1,10);
						}
						for(var j=0;j<numObstacles;j++) {
							if(obstacle[j] !== undefined) {
								obstacle[j].updatePosition();

								if(obstacle[j].getCurrentPoint() < 40) {
									var obsLine = Math.floor((Math.random()*4));
									curObstacleLine[j] = obsLine;
									obstacle[j] = new ObstacleModel(game_model.sprites[j+5], game_model.myLineModel[obsLine], -(Math.random()*2+0.5),199);
								}

								oPos = obstacle[j].getCurrentPoint();

								if(oPos < selectPoint+4 && oPos > selectPoint-2 && curObstacleLine[j] === game_model.currentLine && collisionState === false && betweenLines === false) {
									console.log("Collision in line "+curObstacleLine[j].toString());
									if(collisionState === false) {
										crashSound.play();
										collisionState = true;
										health = health-0.2;
										if(health < 0.75 && currentMood == 2) {
											game_model.backgrounds[1].tween = new Kinetic.Tween({
												node: game_model.backgrounds[1],
												//x: -170,
												//y: -315,
												//scaleX: 0.5,
												//scaleY: 0.5,
												opacity:1,
												easing: Kinetic.Easings.EaseInOut,
												duration: 7

											});
											game_model.backgrounds[1].tween.play();
											currentMood = 1;
										}
										if(health < 0.5 && currentMood == 1) {
											game_model.backgrounds[0].tween = new Kinetic.Tween({
												node: game_model.backgrounds[0],
												//x: -170,
												//y: -315,
												//scaleX: 0.5,
												//scaleY: 0.5,
												opacity:1,
												easing: Kinetic.Easings.EaseInOut,
												duration: 7

											});
											game_model.backgrounds[0].tween.play();
											currentMood = 0;
										}
										if(health < 0) {
											health = 0.5;
											lives -= 1;
											for(var k=0;k<3;k++) {
												if(k < lives) {
													game_model.liveImgs[k].setVisible(true);
												}  else {
													game_model.liveImgs[k].setVisible(false);
												}
												game_view.bglayer.draw();
											}
											if(lives <= 0) {
												health = 0;
												game_model.myLivesText.text('Game Over');
												/*game_model.mySurfText.tween = Kinetic.Tween({
												  node: game_model.mySurfText,
												  x: game_model.width,
												  y: game_model.height,
												  easing: Kinetic.Easings.EaseOut,
												  duration: 3
												  });
												  game_model.mySurfText.tween.play();*/
												game_model.myHB.setVisible(false);
												game_model.myHBFill.setVisible(false);
												game_model.myHBText.setVisible(false);

												game_model.mySurfText.setX(game_model.width/2 - 80);
												game_model.mySurfText.setY(200);
												game_model.myLivesText.setX(game_model.width/2 - 120);
												game_model.myLivesText.setY(150);
												game_model.myLivesText.setVisible(true);
												for(var i = 0; i < 3; i++) {
													game_model.liveImgs[i].setVisible(false);
												}

												game_view.bglayer.draw();
												bgMusic.stop();
												endGameState = true;
											}
										}
									}
								}

								if(collisionState === true) {
									collisionTimer -= 1;
									if(collisionTimer <= 0) {
										collisionState = false;
										collisionTimer = 90;
									}
									console.log(collisionState);
								}
							}
						}
					} else if(state === gameOverState) {
						surfEnable = false;
						game_model.spriteSheet.setVisible(false);
						keyStates.forEach(function(value) {
							if(value) {
								state=initState;
							}
						});
					} else {

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

				if(collisionState === true) {
					game_model.spriteSheet.animation('hit');
					game_model.spriteSheet.setScaleX(-game_model.spriteSheet.getScaleX());
				}




				leftover = leftover + (frame.timeDiff - numUpdates*FPS);
			}, game_view.layer);

			gameLayerLoop.start();

			console.log(game_model);


		});


	};

	return test;
});
