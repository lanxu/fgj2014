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
	    bglayer: null,
	    debuglayer: null,

	    initialize: function (options) {
		    // Center div
		    $("#container").css('width', this.model.width);
		    $("#container").css('height', this.model.height);
		    // Create stage
		    this.stage = new Kinetic.Stage({ container: this.el, width: this.model.width, height: this.model.height });
		    // Create layers
		    this.layer = new Kinetic.Layer();
		    this.bglayer = new Kinetic.Layer();
		    this.debuglayer = new Kinetic.Layer();


		    /*			$(this.stage.getContent()).on('click', function() {
					var myNode = document.querySelector("#container");

					requestFullScreen(myNode);

					$('#container').css('position','absolute');
					$('#container').css('left','0');
					$('#container').css('top','0');
					$('#container').css('border','0');
					$('#container').css('margin','0');

					$("canvas").css('width', (window.innerWidth > 0) ? window.innerWidth : screen.width);
					$("canvas").css('height', (window.innerHeight > 0) ? window.innerHeight : screen.height);
					});
					*/
		    // Create minimum stuff
		    var fpsText = new Kinetic.Text({
			    x: 10,
			y: 10,
			text: 'FPS: ',
			fontSize: 10,
			fontFamily: 'Fullkorn',
			fontStyle: 'bold',
			align: 'left',
			fill: 'white'
		    });
		    this.debuglayer.add(fpsText);
		    // Add Layers to stage
		    //this.stage.add(this.layer);
		    //this.stage.add(this.debuglayer);
		    // Start debug animation
		    var debuganim = new Kinetic.Animation(function(frame) {
			    fpsText.setText('FPS: ' + Math.floor(frame.frameRate));
		    }, this.debuglayer);
		    debuganim.start();

	    },
	    render: function (callback) {
		    var rect = this.model.createRect(
				    (function() {
					    //console.log('Log: '+this); 
					    console.log('Log:');
					    console.log(this);

				
					this.bglayer.add(this.model.backgrounds[0]);
					//this.bglayer.add(this.model.sprites[2]);
					this.bglayer.add(this.model.sprites[1]);

					this.model.sprites[9].scaleX(2);
					this.model.sprites[9].scaleY(2);
					this.model.sprites[9].setX(this.model.width/2-150);
					this.model.sprites[9].setY(this.model.height/2+150);

					this.bglayer.add(this.model.sprites[9]);

					    for(var i = 0; i < 100; i++) {
						    this.layer.add(this.model.stars[i]);
					    }
					this.layer.add(this.model.myLine[0]);
					this.layer.add(this.model.myLine[1]);
					this.layer.add(this.model.myLine[2]);
					this.layer.add(this.model.myLine[3]);
					//this.layer.add(this.model.myHzLine);
					this.layer.add(this.model.sprites[5]);
					this.layer.add(this.model.sprites[6]);
					this.layer.add(this.model.sprites[7]);
					this.layer.add(this.model.sprites[8]);
					//this.layer.add(this.model.myImg);
					this.layer.add(this.model.livesText);
					this.layer.add(this.model.spriteSheet);
					//this.layer.draw();
					this.stage.add(this.bglayer);
					this.stage.add(this.layer);
					this.stage.add(this.debuglayer);
					callback();



				    }).bind(this)	    
		    );
	    }
	});

	return GameView;
});
