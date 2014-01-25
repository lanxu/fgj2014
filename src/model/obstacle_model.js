define(['config','backbone','kinetic'], function (Config, Backbone, Kinetic) {
	// img - Kinetic image
	// lineModel - lineModel from line_model
	var ObstacleModel = function(img, line_model, obstacle_speed, startPoint) {
		var that = {};
		
		var kinImg = img;
		var lineModel = line_model;
		var curLinePoint = startPoint;
		var accPos = startPoint;
		var speed = obstacle_speed; 
		var getCurrentPoint = function() {
			return curLinePoint;
		}
		
		that.getCurrentPoint = getCurrentPoint;
		
		var updatePosition = function() {
			accPos += speed;
			curLinePoint = Math.floor(accPos);
		
			var imgPoint = lineModel.getPoint(curLinePoint);
			if(imgPoint !== null) {
				var scaling_factor = (((200-curLinePoint)*0.003)+0.1);	
				kinImg.setX(imgPoint[0]-scaling_factor*40);
				kinImg.setY(imgPoint[1]-scaling_factor*100);
				//kinImg.setRotation(scaling_factor*360);
				kinImg.scaleX(scaling_factor);
				kinImg.scaleY(scaling_factor);
			}
		}
		that.updatePosition = updatePosition;
		
		return that;
	}
	return ObstacleModel;
});
