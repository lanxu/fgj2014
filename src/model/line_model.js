define(['config','backbone','kinetic'], function (Config, Backbone, Kinetic) {
	var LineModel = function(width, height) {
		var that = {};
		var points = [];
		var maxPoints = 100;
		var center = [width/2, height/2];
		
		that.getPoints =  function() {return points}
		that.maxPoints =  function(max_points) {maxPoints = max_points;}
		
		that.maxPoints = maxPoints;
		var addPoint = function(x,y) {
			if(points.length/2 > maxPoints) {	
				points.splice(0,2);	
			} 
			points.splice(-1, 0, y+center[1], x+center[0]);
		}
		that.addPoint = addPoint;
		console.log(this);
		var movePoints = function() {
			for(var i = 0;i < points.length/2;i++) {
				points[i] += 1;
				points[i+1] += 1;
			}
		}
		that.movePoints = movePoints;
		return that;
	}
	return LineModel;
});