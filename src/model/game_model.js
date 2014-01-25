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
	    initialize: function() {


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
			    this.myImg = yoda;
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
						strokeWidth: 1,
						lineCap: 'round',
						lineJoin: 'round'
					});
					
					var greenLine = new Kinetic.Line({
						points: [],
						stroke: 'green',
						strokeWidth: 1,
						lineCap: 'round',
						lineJoin: 'round'
					});
					
					var blackLine = new Kinetic.Line({
						points: [],
						stroke: 'black',
						strokeWidth: 1,
						lineCap: 'round',
						lineJoin: 'round'
					});
					
					var blueLine = new Kinetic.Line({
						points: [],
						stroke: 'blue',
						strokeWidth: 1,
						lineCap: 'round',
						lineJoin: 'round'
					});
					
					var hzLine = new Kinetic.Line({
						points: [],
						stroke: 'black',
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
