var Boss = function(x, y, gameIndex, game){
	
	this.type = 8;
	this.gameIndex = gameIndex;
	this.game = game;

	this.x = x;
	this.y = y;

	this.health = 15;

	this.topEdge = 0;
	this.bottomEdge = 95;
	this.leftEdge = -36;
	this.rightEdge = 73;
	this.left_index;
	this.right_index;
	this.collision_index;

	this.wait = 0;

	this.frames = [ [47, 285], [47, 380], [167, 380], [281, 380] ]
}

Boss.prototype = {
	
	render: function(context){

		if(this.health > 10){
			context.drawImage(Resource.Image.enemy_spritesheet, this.frames[0][0], this.frames[0][1], 73, 95, this.x - this.game.background.back_x, this.y, 73, 95);
		}
		else if(this.health <= 10 && this.health > 5){
			context.drawImage(Resource.Image.enemy_spritesheet, this.frames[1][0], this.frames[1][1], 73, 95, this.x - this.game.background.back_x, this.y, 73, 95);
		}
		else if(this.health <= 5 && this.health > 0){
			context.drawImage(Resource.Image.enemy_spritesheet, this.frames[2][0], this.frames[2][1], 73, 95, this.x - this.game.background.back_x, this.y, 73, 95);
		}
		else{
			context.drawImage(Resource.Image.enemy_spritesheet, this.frames[3][0], this.frames[3][1], 79, 95, this.x - this.game.background.back_x - 6, this.y, 79, 95);
		}

	},

	update: function(){

		if(this.health > 0 && this.wait <= 0 && this.game.heli.x > 5000){

			Resource.Audio.missile.play();

			var missile = new Missile(this.x - 25, this.y + 40, this.game.heli.x - this.game.background.back_x, this.game.heli.y, -5, this.game.missiles.length, this.game);
			this.game.collision_system.add(missile, missile.x - missile.leftEdge, missile.x + missile.rightEdge);
			this.game.missiles.push(missile);

			this.wait = 500 / this.health;
		}

		this.wait--;

	},

	collide: function(object){

		switch(object.type){

			case 2:
				this.game.collision_system.remove(object.collision_index);
				this.game.removeObject(this.game.bullets, object.gameIndex);

				this.health--;
				Resource.Audio.explosion.play();

				break;
			case 3:

				if(!object.exploding){
					object.exploding = true;
					this.health -= 2;
					Resource.Audio.explosion.play();
				}
				break;
		}
	}
}