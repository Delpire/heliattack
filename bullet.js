
var Bullet = function(x, y){
	
	this.x = x;
	this.y = y;
	this.radius = 1;

}

Bullet.prototype = {

	render: function(context){

		context.save();
		context.strokeStyle = "#000000";
		context.fillStyle = "#aaaaaa";
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
		context.fill();
		context.stroke();
		context.restore();

	},

	update: function(){
		this.x += 5;
	}

}