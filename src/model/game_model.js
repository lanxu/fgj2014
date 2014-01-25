define(['config','backbone','kinetic', 'linemodel'], function (Config, Backbone, Kinetic, LineModel) {
	var GameModel = Backbone.Model.extend({
		name: 'The best game ever',
	    myRect: null,
	    myImg: null,
	    myLineModel: [],
	    myLine: [],
	    myHzLine: null,

	    // Galaxy SII resolution
	    width: 800,
	    height: 480,
	    imageObj: null,
	    sprites: [],
	    initialize: function() {
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
				    './web/images/surfer.png',
				    './web/images/life.png',
				    './web/images/title.png',
				    './web/images/title_extreme.png',
				    './web/images/space.jpg'
				    );

		    loadImages(sources,
				    (function() {
					    console.log('all loaded');
					    console.log(this.sprites);
				    }).bind(this));


	    },
	    createRect : function(callback) {
		    this.imageObj= new Image();
		    this.imageObj.onload = (function() {
			    var yoda = new Kinetic.Image({
				    x: 300,
				y: 100,
				image: this.imageObj,
				draggable: false,
			    });
			    console.log('Loaded');
			    console.log(this.sprites[0]);
			    this.myImg = this.sprites[0];
			    console.log('Created a rectangle');
			    var rect=new Kinetic.Rect({
				    x: 10,
				y: 10,
				width: 100,
				height: 50,
				fill: 'green',
				stroke: 'black',
				strokeWidth: 1,
				offset: [0, 0],
				draggable: false,
			    });

			    var redLine = new Kinetic.Line({
				    points: [],
				stroke: 'red',
				strokeWidth: 3,
				lineCap: 'round',
				lineJoin: 'round'
			    });

			    var greenLine = new Kinetic.Line({
				    points: [],
				stroke: 'green',
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
				stroke: 'blue',
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

			    var lineModel = [];
			    lineModel[0] = new LineModel(this.width,this.height);
			    lineModel[1] = new LineModel(this.width,this.height);
			    lineModel[2] = new LineModel(this.width,this.height);
			    lineModel[3] = new LineModel(this.width,this.height);


			    this.myRect = rect;
			    this.myLine[0] = redLine;
			    this.myLine[1] = greenLine;
			    this.myLine[2] = blackLine;
			    this.myLine[3] = blueLine;
			    this.myHzLine = hzLine;
			    this.myLineModel = lineModel;
			    callback();
		    }).bind(this);
		    this.imageObj.src = './web/images/HTML5_Badge_128.png';
		    //this.imageObj.src ='http://www.html5canvastutorials.com/demos/assets/yoda.jpg';

		    return null;
	    }
	});

	return GameModel;
});
