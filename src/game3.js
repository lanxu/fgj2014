var keyStates = [];
var anim_loop = 0;
var moving_loop = 0;
var particle_id = 0;

var target_x = 400;
var target_y = 200;
var deg2rad = Math.PI/180;
var rad2deg = 180/Math.PI;

var particles = new Array();
var particles2 = new Array();


function onKeyDown(evt){
	keyStates[evt.keyCode] = true;
}

function onKeyUp(evt){
	keyStates[evt.keyCode] = false;
}
function onMouseMove(evt){
	target_x = evt.clientX;
	target_y = evt.clientY;
	//console.log(this.particles[0].attrs);
	//
	// Formation 1
	var circle1 = 360 / 50;
	var circle2 = 360 / 30;
	var circle3 = 360 / 20;
	
	for(r = 0; r < 50; r++) {
		if(this.particles[r].attrs.health >= 0) {
			this.particles[r].attrs.target_x = target_x + 100*Math.cos(r*circle1*deg2rad);		
			this.particles[r].attrs.target_y = target_y + 100*Math.sin(r*circle1*deg2rad);
		}
	}
	for(r = 0; r < 30; r++) {
		if(this.particles[50+r].attrs.health >= 0) {
			this.particles[50+r].attrs.target_x = target_x + 70*Math.cos(r*circle2*deg2rad);		
			this.particles[50+r].attrs.target_y = target_y + 70*Math.sin(r*circle2*deg2rad);
		}
	}
	for(r = 0; r < 20; r++) {
		if(this.particles[80+r].attrs.health >= 0) {
			this.particles[80+r].attrs.target_x = target_x + 40*Math.cos(r*circle3*deg2rad);		
			this.particles[80+r].attrs.target_y = target_y + 40*Math.sin(r*circle3*deg2rad);
		}
	}

}
window.addEventListener('keydown', onKeyDown, true);
window.addEventListener('keyup', onKeyUp, true);
window.addEventListener('mousemove', onMouseMove, false);
//window.onload = function() {
var game = function() {
	var version = null;
	var today = new Date();
	var FPS = 1000/30;
	
	// Fix for cache
	if(gameContainer.env == 'dev') {
		version = today.getDay() + "_" + today.getHours() + "_" + today.getSeconds();
	} else {
		version = gameContainer.gameVersion;
	};

	// Get graphics
	require(["src/config.js?v="+version+"", 
	         "src/ui/ui.element.js?v="+version+"",
	         "src/avatar.js?v="+version+"", 
	         "src/ui/ui.button.js?v="+version+""], function() {
		// Load config
		gameContainer.conf = new Config({});

		console.log("Starting game...");
		console.log("Size: " + gameContainer.conf.get('windowWidth') + " x " + gameContainer.conf.get('windowHeight'));

		var stage = new Kinetic.Stage({
			container: 'container',
			width: gameContainer.conf.get('windowWidth'),
			height: gameContainer.conf.get('windowHeight'),
			scale: [1,1],
		});
		

		var uiLayer = new Kinetic.Layer();
		var gameLayer = new Kinetic.Layer();
	
		//var imageObj = new Image();
		//imageObj.onload = function() {
		

			for(var i = 0; i < 100; i++) {
				particles[i] = new Kinetic.Ellipse({
					x: Math.floor(Math.random()*800),
					y: Math.floor(Math.random()*400),
					radius: {
						x: 5,
						y: 3,
					},
					fill: 'red',
					/*stroke: 'white',
					strokeWidth: 2,
					align: 'center'*/
					velocity_x: 0,
					velocity_y: 0,
					target_x: target_x,
					target_y: target_y,
					target_idx: -1,
					health: 100,
					speed_efficiency: Math.random()+0.5,
					fitness: 0,
					angle: 0
				});
				//particles[i].prototype.velocity_x = 0;
				//particles[i].prototype.velocity_y = 0;
				gameLayer.add(particles[i]);
				
			}
			for(var i = 0; i < 100; i++) {
				particles2[i] = new Kinetic.Ellipse({
					x: Math.floor(Math.random()*800),
					y: Math.floor(Math.random()*400),
					radius: {
						x: 5,
						y: 3,
					},
					fill: 'blue',
					/*stroke: 'white',
					strokeWidth: 2,
					align: 'center'*/
					velocity_x: 0,
					velocity_y: 0,
					target_x: target_x,
					target_y: target_y,
					target_idx: -1,
					health: 100,
					speed_efficiency: Math.random()+0.5,
					fitness: 0,
					angle: 0
				});
				//particles[i].prototype.velocity_x = 0;
				//particles[i].prototype.velocity_y = 0;
				gameLayer.add(particles2[i]);
				
			}
			var fpsText = new Kinetic.Text({
				x: 10,
				y: 10,
				text: 'FPS: ',
				fontSize: 16,
				fontFamily: 'Cutive Mono',
				fontStyle: 'bold',
				align: 'left',
				fill: 'black'
			});

					for(var j = 0; j < 100; j++) {
						var target_idx = Math.floor(Math.random()*100);
						particles2[j].attrs.target_idx = target_idx;
						particles2[j].attrs.target_x = particles[target_idx].getX();
						particles2[j].attrs.target_y = particles[target_idx].getY();
					}

			uiLayer.add(fpsText);
	
			stage.add(gameLayer);
			stage.add(uiLayer);


			//uiLayer.setOpacity(0.5);

			var leftover = 0;
//			var counter = 0;
//			var particle = 0;

			var uiLayerLoop = new Kinetic.Animation(function(frame) {
				// FPS				
				fpsText.setText('FPS: ' + Math.floor(frame.frameRate)+' ('+keyStates.length+')');
			}, uiLayer);
			
			var gameLayerLoop = new Kinetic.Animation(function(frame) {
				// How many logic updates needs to be done to keep up with the target FPS?
				
				var numUpdates = Math.floor((frame.timeDiff + leftover) / FPS);
				var moving = false;

				for(var i = 0; i < numUpdates; i++) {
					anim_loop++;
					// Logic updates!
					if(keyStates[38] === true) {
						/*shadow.setY(shadow.getY()-5);
						moving = true;*/
					}
					if(keyStates[40] === true) {
						/*avatar.set('y', avatar.get('y') + 5);
						moving_y = +1;*/

					}
					if(keyStates[37] === true) {
					/*	avatar.set('x', avatar.get('x') - 5);
						moving_x = -1;
*/
						/*
						character.setX(character.getX()-5);
						shadow.setX(shadow.getX()-5);*/
						moving = true;
					}
					if(keyStates[39] === true) {
/*						avatar.set('x', avatar.get('x') + 5);
						moving_x = +1;
*/						
						/*character.setX(character.getX()+5);
						shadow.setX(shadow.getX()+5);*/
						moving = true;
					}
				
					// calculate fitness (not required for movement, but let's do it for AI)
					for(var j = 0; j < 100; j++) {
						particles[j].attrs.fitness = Math.abs(particles[j].getX() - particles[j].attrs.target_x) + Math.abs(particles[j].getY() - particles[j].attrs.target_y);
					}
					for(var j = 0; j < 100; j++) {
						particles2[j].attrs.fitness = Math.abs(particles2[j].getX() - particles2[j].attrs.target_x) + Math.abs(particles2[j].getY() - particles2[j].attrs.target_y);
					}

					// update target

					for(var j = 0; j < 100; j++) {
						if(particles2[j].attrs.target_idx != -1) {
							
							particles2[j].attrs.target_x = particles[particles2[j].attrs.target_idx].getX();
							particles2[j].attrs.target_y = particles[particles2[j].attrs.target_idx].getY();
							// Shoot!
							if(Math.abs(particles[particles2[j].attrs.target_idx].getX() - particles2[j].getX()) + Math.abs(particles[particles2[j].attrs.target_idx].getY() - particles2[j].getY()) < 50) {
								//
								particles[particles2[j].attrs.target_idx].attrs.health--;
								var h = particles[particles2[j].attrs.target_idx].attrs.health;
								if(h <= 0) {
									particles[particles2[j].attrs.target_idx].setFill('FFDDDD');
									var target_idx = Math.floor(Math.random()*100);
									particles2[j].attrs.target_idx = target_idx;
								} 

								//particles[particles2[j].attrs.target_idx].setFill('FFFFFF');
								
							}
						}
					}



					// update particles
					for(var j = 0; j < 100; j++) {
						// Calculate angle and speed

						// Move to particles coordinate system

						var diffx = 0;
						var diffy = 0;
						var angle = 0;
						diffx = (particles[j].attrs.target_x - particles[j].getX());
						diffy = (particles[j].attrs.target_y - particles[j].getY());
						
						// Behold! The power of trigonometry!
						angle = Math.atan2(diffy,diffx)*rad2deg; 
						currentAngle = particles[j].attrs.angle;

						if(angle < -180)
							angle +=360;
						if(angle > 180)
							angle -=360;
						

						//var diffa = Math.abs(angle - currentAngle);
						// atan2 gives
						// -180  --> 180
					
						if(angle >= currentAngle) {
							// Check which way is faster
							var a = angle - currentAngle;
							var b = 360-angle + currentAngle;

							if(a > b) {
								diffa = b;
								particles[j].attrs.angle += 6;
							} else {
								diffa = a;
								particles[j].attrs.angle -= 6;
							}
						} else {
							var a = currentAngle - angle;
							var b = 360-currentAngle + angle;
							
							if(a < b) {
								diffa = a;
								particles[j].attrs.angle += 6;
							} else {
								diffa = b;
								particles[j].attrs.angle -= 6;
							}

						}
						
						// Destination speed
						var speed_d = particles[j].attrs.fitness;

						speedx = -Math.cos(particles[j].attrs.angle * deg2rad) * Math.log(speed_d);
						speedy = -Math.sin(particles[j].attrs.angle * deg2rad) * Math.log(speed_d);

						particles[j].attrs.velocity_x = speedx * particles[j].attrs.speed_efficiency;
						particles[j].attrs.velocity_y = speedy * particles[j].attrs.speed_efficiency;

						// Update position
						particles[j].setX(particles[j].getX()+particles[j].attrs.velocity_x);
						particles[j].setY(particles[j].getY()+particles[j].attrs.velocity_y);
						particles[j].setRotation(particles[j].attrs.angle * deg2rad);
					}
					// update particles
					for(var j = 0; j < 100; j++) {
						// Calculate angle and speed

						// Move to particles coordinate system

						var diffx = 0;
						var diffy = 0;
						var angle = 0;
						diffx = (particles2[j].attrs.target_x - particles2[j].getX());
						diffy = (particles2[j].attrs.target_y - particles2[j].getY());
						
						// Behold! The power of trigonometry!
						angle = Math.atan2(diffy,diffx)*rad2deg; 
						currentAngle = particles2[j].attrs.angle;

						if(angle < -180)
							angle +=360;
						if(angle > 180)
							angle -=360;
						

						//var diffa = Math.abs(angle - currentAngle);
						// atan2 gives
						// -180  --> 180
					
						if(angle >= currentAngle) {
							// Check which way is faster
							var a = angle - currentAngle;
							var b = 360-angle + currentAngle;

							if(a > b) {
								diffa = b;
								particles2[j].attrs.angle += 6;
							} else {
								diffa = a;
								particles2[j].attrs.angle -= 6;
							}
						} else {
							var a = currentAngle - angle;
							var b = 360-currentAngle + angle;
							
							if(a < b) {
								diffa = a;
								particles2[j].attrs.angle += 6;
							} else {
								diffa = b;
								particles2[j].attrs.angle -= 6;
							}

						}
						
						// Destination speed
						var speed_d = particles2[j].attrs.fitness;

						speedx = -Math.cos(particles2[j].attrs.angle * deg2rad) * Math.log(speed_d);
						speedy = -Math.sin(particles2[j].attrs.angle * deg2rad) * Math.log(speed_d);

						particles2[j].attrs.velocity_x = speedx * particles2[j].attrs.speed_efficiency;
						particles2[j].attrs.velocity_y = speedy * particles2[j].attrs.speed_efficiency;
						// Update position
						particles2[j].setX(particles2[j].getX()+particles2[j].attrs.velocity_x);
						particles2[j].setY(particles2[j].getY()+particles2[j].attrs.velocity_y);
						particles2[j].setRotation(particles2[j].attrs.angle * deg2rad);
					}
				}
				
				leftover = leftover + (frame.timeDiff - numUpdates*FPS);

			}, gameLayer);
			
			uiLayerLoop.start();	
			gameLayerLoop.start();

			uiLayer.on('mousemove', function() {
				console.log('fa');
			});
		 });
};
