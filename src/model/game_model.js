define(['config','backbone','kinetic', 'linemodel','obstaclemodel'], function (Config, Backbone, Kinetic, LineModel, ObstacleModel) {
	var GameModel = Backbone.Model.extend({
		name: 'The best game ever',
	    myRect: null,
	    myImg: null,
	    myLineModel: [],
	    myLine: [],
	    myHzLine: null,
	    currentLine: 0,
	    // Galaxy SII resolution
	    width: 800,
	    height: 480,
	    imageObj: null,
	    sprites: [],
	    backgrounds: [],
	    lives: 3,
	    livesText: null,
	    starsPosition: [],
	    starsVelocity: [],
	    stars: [],
	    particles: [],

	    initialize: function() {
		    for(var i = 0; i < 100; i++) {
			    this.starsPosition.splice(-1, 0, 
					    Math.random()*2000-1000,
					    Math.random()*2000-1000, 
					    Math.random()*900+100);
			    this.starsVelocity.splice(-1,0,Math.random()*10+1);
			    /*this.stars[i] = new Kinetic.Star({
			      x: this.width/2,
			      y: this.height/2,
			      numPoints: 5,
			      innerRadius: 2,
			      outerRadius: 4,
			      fill: 'white',
			      stroke: 'white',
			      opacity: 1,
			      strokeWidth: 1
			      });*/
			    this.stars[i] = new Kinetic.Circle({
				    x: this.width/2,
				    y: this.height/2,
				    radius: 5,
				    fill: 'white',
				    stroke: 'white',
				    opacity: 1,
				    strokeWidth: 1
			    });

		    }
		    console.log(this.starsPosition.length);



	    },
	    createRect : function(callback) {
		    var loadImages = function(sources, callback) {
			    //A second array for storing Kinetic Objects
			    var images = {};
			    var loadedImages = 0;
			    var numImages = 0;
			    for(var src in sources) {
				    numImages++;
			    }
			    //document.getElementById('ImageIndex').value
			    //document.getElementById('TotalIndex').value="/"+numImages;
			    for(var src in sources) {
				    images[src] = new Image();
				    this.sprites[src] = new Kinetic.Image({
					    //your config and source here
					    x: 300,
					    y: 100,
					    image: images[src],
					    draggable: false,
				    });

				    images[src].onload = function() {
					    if(++loadedImages >= numImages) {
						    callback(images);
					    }
				    };
				    images[src].src = sources[src];
			    }
		    }.bind(this);
		    var sources = new Array(
				    './web/images/surfer.png',  // 0
				    './web/images/life.png',
				    './web/images/title.png',
				    './web/images/title_extreme.png',
				    './web/images/space.jpg',
				    './web/images/obstacle1.png', // 5
				    './web/images/obstacle1.png',
				    './web/images/obstacle1.png',
				    './web/images/obstacle1.png',
				    './web/images/planet1.png' // 9

				    );
		    loadImages(sources,
				    (function() {
					    console.log('all loaded');
					    console.log(this.sprites);
					    this.backgrounds[0] = this.sprites[4];
					    this.backgrounds[0].setX(0);
					    this.backgrounds[0].setY(0);
					    this.myImg = this.sprites[0];
					    this.sprites[2].setX(10);
					    this.sprites[2].setY(10);
					    this.sprites[1].setX(10);
					    this.sprites[1].setY(10);
					    this.sprites[1].setScaleX(0.5);
					    this.sprites[1].setScaleY(0.5);

					    var redLine = new Kinetic.Line({
						    points: [],
						stroke: 'white',
						strokeWidth: 3,
						lineCap: 'round',
						lineJoin: 'round'
					    });

					    var greenLine = new Kinetic.Line({
						    points: [],
						stroke: 'white',
						strokeWidth: 3,
						lineCap: 'round',
						lineJoin: 'round'
					    });

					    var blackLine = new Kinetic.Line({
						    points: [],
						stroke: 'white',
						strokeWidth: 3,
						lineCap: 'round',
						lineJoin: 'round'
					    });

					    var blueLine = new Kinetic.Line({
						    points: [],
						stroke: 'white',
						strokeWidth: 3,
						lineCap: 'round',
						lineJoin: 'round'
					    });

					    var hzLine = new Kinetic.Line({
						    points: [],
						stroke: 'white',
						strokeWidth: 2,
						lineCap: 'round',
						lineJoin: 'round'
					    });
					    this.livesText = new Kinetic.Text({
						    x: 70,
						    y: 10,
						    text: '' + this.lives,
						    fontSize: 42,
						    fontFamily: 'Fullkorn',
						    fontStyle: 'bold',
						    align: 'left',
						    fill: 'white'
					    });

					    var lineModel = [];
					    lineModel[0] = new LineModel(this.width,this.height);
					    lineModel[1] = new LineModel(this.width,this.height);
					    lineModel[2] = new LineModel(this.width,this.height);
					    lineModel[3] = new LineModel(this.width,this.height);


					    this.myLine[0] = redLine;
					    this.myLine[1] = greenLine;
					    this.myLine[2] = blackLine;
					    this.myLine[3] = blueLine;
					    this.myHzLine = hzLine;
					    this.myLineModel = lineModel;
					    callback();

				    }).bind(this));
		    return null;
	    }
	});

	return GameModel;
});
