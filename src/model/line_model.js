define(['config','backbone','kinetic'], function (Config, Backbone, Kinetic) {
	var LineModel = function(width, height) {
		var that = {};
		var points = [];
		var pointAngles = [];
		var maxPoints = 200;
		var center = [width/2, height/2];
		
		that.getPoints =  function() {return points}
		that.maxPoints =  function(max_points) {maxPoints = max_points;}
		
		that.maxPoints = maxPoints;
		var addPoint = function(x,y) {
			if(points.length/2 > maxPoints) {	
				points.shift();
				points.shift();
				pointAngles.shift();
			}
			points.push(x+center[0]);
			points.push(y+center[1]);
			pointAngles.push(Math.atan2(x, y));
		}
		that.addPoint = addPoint;
		var getPoint = function(pointNum) {
			if(pointNum < points.length/2) {
				return [points[pointNum*2], points[pointNum*2+1]];
			} else {
				return null;
			}
		}
		that.getPoint = getPoint;
		var getPointDiffAngle = function(pointNum) {
			var angle1 = Math.atan2(points[pointNum+1]-points[pointNum-1],points[pointNum]-points[pointNum-2])+Math.PI/2;
			console.log(angle1*(180/Math.PI));
			return angle1;
		}
		that.getPointDiffAngle = getPointDiffAngle;
		var movePoints = function() {
			for(var i = 0;i < points.length/2;i++) {
				points[i*2] += Math.sin(pointAngles[i])*3;
				points[i*2+1] += Math.cos(pointAngles[i])*3;
			}
		}
		that.movePoints = movePoints;
		return that;
	}
	return LineModel;
});
