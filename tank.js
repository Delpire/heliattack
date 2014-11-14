var Tank = function(x, y, gameIndex, game){

	this.type = 7;
	this.game = game;
	this.gameIndex = gameIndex;

	this.x = x;
	this.y = y;

	this.pitch_angle = 0;

	this.topEdge = 0;
	this.bottomEdge = 102;
	this.leftEdge = 0;
	this.rightEdge = 45;
	this.left_index;
	this.right_index;
	this.collision_index;

	this.wait = 0;

	this.state = 0;
}

Tank.prototype = {

	render: function(context){
		
		context.drawImage(Resource.Image.enemy_spritesheet, 13, 26, 102, 45, this.x - this.game.background.back_x, this.y, 102, 45);

		context.save();
		context.translate(this.x + 30 - this.game.background.back_x, this.y + 7);
		context.rotate(this.pitch_angle);
		context.translate(-40, -3);
		context.drawImage(Resource.Image.enemy_spritesheet, 0, 0, 40, 6, 0, 0, 40, 6);
		context.restore();

		
	},

	update: function(){

		if(this.x - this.game.heli.x > 300 && this.x - this.game.heli.x < 1000){
			this.x -= 5;
		}

		if(this.x - this.game.heli.x < 300){
			this.x += 3;
		}

		this.pitch_angle = Math.atan((this.y - 3 - this.game.heli.y) / (this.x - 40 - this.game.heli.x + this.game.background.back_x)) + 0.15;

	},

	collide: function(object){

	}
}
