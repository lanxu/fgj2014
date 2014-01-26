define(['config','backbone','kinetic', 'linemodel','obstaclemodel'], function (Config, Backbone, Kinetic, LineModel, ObstacleModel) {
	var GameModel = Backbone.Model.extend({
		name: 'The best game ever',
	    myRect: null,
	    myImg: null,
	    myLineModel: [],
	    myLine: [],
	    myHB: null,
	    myHBFill : null,
	    myHBText : null,
	    myHzLine: null,
	    myLivesText: null,
			mySurfText: null,
	    currentLine: 0,
	    // Galaxy SII resolution
	    width: 800,
	    height: 480,
	    imageObj: null,
	    sprites: [],
	    backgrounds: [],
	    liveImgs: [],
	    lives: 3,
	    livesText: null,
	    starsPosition: [],
	    starsVelocity: [],
	    stars: [],
	    particles: [],
	    spriteSheet: null,
	    title: null,
	    title_extreme: null,
	    startText: null,
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

				    images[src].onload = (function() {
					    //console.log(this.sprites[src].attrs.image);
					    //this.sprites[src].attrs.image.width;
					    //this.sprites[src].offsetX(1000);
					    //this.sprites[src].offsetY(1000);
					    if(++loadedImages >= numImages) {
						    callback(images);
					    }
				    }).bind(this);
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
				    './web/images/planet1.png', // 9
				    './web/images/sprite.png'

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


					    this.liveImgs[0] = new Kinetic.Image({
						    //your config and source here
						    x: 10,
						    y: 10,
						    scaleX: 0.5,
						    scaleY: 0.5,
						    image: this.sprites[1].attrs.image,
						    draggable: false,
					    });
					    this.liveImgs[1] = new Kinetic.Image({
						    //your config and source here
						    x: 70,
						    y: 10,
						    scaleX: 0.5,
						    scaleY: 0.5,
						    image: this.sprites[1].attrs.image,
						    draggable: false,
					    });
					    this.liveImgs[2] = new Kinetic.Image({
						    //your config and source here
						    x: 130,
						    y: 10,
						    scaleX: 0.5,
						    scaleY: 0.5,
						    image: this.sprites[1].attrs.image,
						    draggable: false,
					    });


					    //this.sprites[1];


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
							
						var surfText = new Kinetic.Text({
							x: 500,
							y: 10,
							text: '',
							fontSize: 24,
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

					    var hb = new Kinetic.Rect({
						    width: 150,
						height: 15,
						x: 5,
						y: 60,
						fill: 'black',
						stroke: 'white',
						strokeWidth: 3
					    });

					    var hbFill = new Kinetic.Rect({
						    width: 72,
						height: 9,
						x: 8,
						y: 63,
						fill: 'red',
						stroke: 'white',
						strokeWidth: 0
					    });

					    var startText = new Kinetic.Text({
						x: this.width/2-360,
						y: 360,
						text: "PRESS ANY KEY TO START",
						fontSize: 48,
						fontFamily: 'Fullkorn',
						fontStyle: 'bold',
						align: 'right',
						fill: 'white'
					    });

					    var moodText = new Kinetic.Text({
						    x: 20,
						y: 80,
						text: "Mood meter",
						fontSize: 24,
						fontFamily: 'Fullkorn',
						fontStyle: 'bold',
						align: 'left',
						fill: 'white'
					    });
					    this.startText = startText;
					    this.myLivesText = this.livesText;
					    this.myHB = hb;
					    this.myHBFill = hbFill;
					    this.myHBText = moodText;
					    this.myLine[0] = redLine;
					    this.myLine[1] = greenLine;
					    this.myLine[2] = blackLine;
					    this.myLine[3] = blueLine;
					    this.myHzLine = hzLine;
					    this.myLineModel = lineModel;
							this.mySurfText = surfText;
					    this.spriteSheet = new Kinetic.Sprite({
						    x: 250,
						    y: 40,
						    image: this.sprites[10].attrs.image,
						    animation: 'idle',
						    animations: {
							    idle: [
						    // x, y, width, height (4 frames)
						    0,0,127,127,
						    129,129,127,127,
						    ],
						    jump: [
						    // x, y, width, height (3 frames)
						    0,129,127,127,
						    129,129,127,127,
						    ],
						    hit: [
						    0,257,127,127,
						    ]
						    },
						    frameRate: 7,
						    frameIndex: 0,
						    offset: {x:64, y:64}
					    });
					    this.title = this.sprites[2];
					    this.title_extreme = this.sprites[3];

					    this.title.setX(this.width/2-200);
					    this.title_extreme.setY(this.height/2);
					    this.title_extreme.setX(this.width/2-200);
					    this.title_extreme.scaleX(0.7);
					    this.title_extreme.scaleY(0.7);

					    this.spriteSheet.setX(-200);
					    this.sprites[5].setX(-200);
					    this.sprites[6].setX(-200);
					    this.sprites[7].setX(-200);
					    this.sprites[8].setX(-200);
					    this.myHB.setVisible(false);
					    this.myHBFill.setVisible(false);
					    this.myHBText.setVisible(false);
					    this.myLivesText.setVisible(false);

					    //this.spriteSheet.start();
					    callback();

				    }).bind(this));
		    return null;
	    }
	});

	return GameModel;
});
