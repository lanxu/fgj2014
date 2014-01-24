define(['config','backbone','kinetic', 'linemodel'], function (Config, Backbone, Kinetic, LineModel) {
	var GameModel = Backbone.Model.extend({
		name: 'The best game ever',
	    myRect: null,
	    myImg: null,
			myLineModel: null,
			myLine: null,
			
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
					
					var lineModel = new LineModel(this.width,this.height);
					
			    this.myRect = rect;
					this.myLine = redLine;
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
