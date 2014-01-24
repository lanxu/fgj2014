define(['config', 'backbone', 'kinetic','jquery'], function (Config, Backbone, Kinetic) {


	function requestFullScreen(element) {
		// Supports most browsers and their versions.
		var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

		if (requestMethod) { // Native full screen.
		requestMethod.call(element);
		} else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
		var wscript = new ActiveXObject("WScript.Shell");
		if (wscript !== null) {
		wscript.SendKeys("{F11}");
		}
		}
		}


	var GameView = Backbone.View.extend({
		tagName: 'span',
		stage: null,
		layer: null,
		debuglayer: null,

		initialize: function (options) {
			// Center div
			$("#container").css('width', this.model.width);
			$("#container").css('height', this.model.height);
			// Create stage
			this.stage = new Kinetic.Stage({ container: this.el, width: this.model.width, height: this.model.height });
			// Create layers
			this.layer = new Kinetic.Layer();
			this.debuglayer = new Kinetic.Layer();

			// Add Layers to stage
			this.stage.add(this.layer);
			this.stage.add(this.debuglayer);
			$(this.stage.getContent()).on('click', function() {
				var myNode = document.querySelector("#container");
				//myNode.mozRequestFullScreen();
				//myNode.webkitRequestFullScreen();
				
				requestFullScreen(myNode);
				/*$("#borders").css('width', (window.innerWidth > 0) ? window.innerWidth : screen.width);
				$("#borders").css('height', (window.innerHeight > 0) ? window.innerHeight : screen.height);
			*/
				
				$('#container').css('position','absolute');
				$('#container').css('left','0');
				$('#container').css('top','0');
				$('#container').css('border','0');
				$('#container').css('margin','0');
			
				$("canvas").css('width', (window.innerWidth > 0) ? window.innerWidth : screen.width);
				$("canvas").css('height', (window.innerHeight > 0) ? window.innerHeight : screen.height);
			});

			// Create minimum stuff
			var fpsText = new Kinetic.Text({
				x: 10,
				y: 10,
				text: 'FPS: ',
				fontSize: 30,
				fontFamily: 'Fullkorn',
				fontStyle: 'bold',
				align: 'left',
				fill: 'black'
			});
			this.debuglayer.add(fpsText);

			// Start debug animation
			var debuganim = new Kinetic.Animation(function(frame) {
				fpsText.setText('FPS: ' + Math.floor(frame.frameRate));
			}, this.debuglayer);
			debuganim.start();

		},
		render: function () {
			var rect = this.model.createRect(
				(function() {
					//console.log('Log: '+this); 
					console.log('Log:');
					console.log(this);
					this.layer.add(this.model.myRect);
					this.layer.add(this.model.myImg);
					this.layer.add(this.model.myLine);
					
					this.stage.add(this.layer);


		}).bind(this)	    
			);
	}
	});

	return GameView;
	});
