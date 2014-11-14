var Tank = function(x, y, gameIndex, game){

	this.type = 7;
	this.game = game;
	this.gameIndex = gameIndex;

	this.x = x;
	this.y = y;

	this.angle = 0;

	this.topEdge = 0;
	this.bottomEdge = 102;
	this.leftEdge = 0;
	this.rightEdge = 45;
	this.left_index;
	this.right_index;
	this.collision_index;

	this.lastMove = 0;

	this.wait = 0;

	this.state = 0;
}

Tank.prototype = {

	render: function(context){
		
		context.drawImage(Resource.Image.enemy_spritesheet, 13, 26, 102, 45, this.x - this.game.background.back_x, this.y, 102, 45);

		context.save();
		context.translate(this.x + 30 - this.game.background.back_x, this.y + 7);
		context.rotate(this.angle);
		context.translate(-40, -3);
		context.drawImage(Resource.Image.enemy_spritesheet, 0, 0, 40, 6, 0, 0, 40, 6);
		context.restore();

		
	},

	update: function(){

		this.lastMove = 0;

		if(this.x - this.game.heli.x > 300 && this.x - this.game.heli.x < 1000){
			this.x -= 5;
			this.lastMove = 5;
		}

		if(this.x - this.game.heli.x < 300){
			this.x += 3;
			this.lastMove = -3;
		}

		this.angle = Math.atan((this.y - 3 - this.game.heli.y) / (this.x - 40 - this.game.heli.x + this.game.background.back_x)) + 0.15;

		if(this.wait <= 0){

			Resource.Audio.bullet.play();

			bullet = new Bullet(this.x - 15, this.y - 15, -5 * Math.cos(this.angle), -5 * Math.sin(this.angle), this.game.bullets.length, this.game);
			this.game.collision_system.add(bullet, bullet.x - bullet.leftEdge, bullet.x + bullet.rightEdge);
			this.game.bullets.push(bullet);

			this.wait = 50;
		}

		this.wait--;

	},

	undo: function(){
		this.x += this.lastMove;
		this.angle = Math.atan((this.y - 3 - this.game.heli.y) / (this.x - 40 - this.game.heli.x + this.game.background.back_x)) + 0.15;
		this.wait = 50;
	},

	collide: function(object){

		switch(object){

			case 2:
				this.game.collision_system.remove(object.collision_index);
				this.game.removeObject(this.game.bullets, object.gameIndex);

				this.game.collision_system.remove(this.collision_index);
				this.game.removeObject(this.game.tanks, this.gameIndex)
				this.game.score += 10;
				Resource.Audio.explosion.play();

				break;
			case 3:
				object.exploding = true;

				this.game.collision_system.remove(this.collision_index);
				this.game.removeObject(this.game.tanks, this.gameIndex)
				this.game.score += 10;
				Resource.Audio.explosion.play();
				break;
			case 6:
				this.undo();
				break;
		}
	}
}
