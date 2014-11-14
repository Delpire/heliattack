var EnemyHelicopter = function(x, y, gameIndex, game){

	this.type = 5;
	this.game = game;
	this.gameIndex = gameIndex;

	this.x = x;
	this.y = y;

	this.topEdge = 0;
	this.bottomEdge = 43;
	this.leftEdge = 0;
	this.rightEdge = 114;
	this.left_index;
	this.right_index;
	this.collision_index;

	this.health = 2;

	this.animation_frame = 0;
	this.number_of_frames = 0;

	this.wait = 50;

	this.state = 0;
}

EnemyHelicopter.prototype = {

	render: function(context){

		context.drawImage(Resource.Image.enemy_spritesheet, 120 * this.animation_frame, 220, 114, 43, this.x - this.game.background.back_x, this.y, 114, 43);

	},

	update: function(){

		this.number_of_frames++;
		
		if(this.number_of_frames == 2){
		  this.animation_frame = (this.animation_frame + 1) % 4;
		  this.number_of_frames = 0;
		}

		if(this.x <= this.game.background.back_x + 1000 && this.state === 0){
			this.state = 1;
		}
		
		if(this.x - this.game.heli.x > 500 && this.state == 1){
			this.x -= 5;
		}

		if(this.x - this.game.heli.x < 450 && this.state == 1){
			this.x += 7;
		}

		if(this.y - this.game.heli.y < -5 && this.state == 1){
			this.y += 2;
		}
		else if(this.y - this.game.heli.y > 5 && this.state == 1){
			this.y -= 1;
		}
		else if(this.y - this.game.heli.y > -5 && this.y - this.game.heli.y < 5 && this.state == 1){
			this.state = 2;
		}

		if(this.state == 2){
			
			if(this.wait === 0){
				this.state = 1;
				this.wait = 50;
			}

			if(this.wait % 50 === 0){

				Resource.Audio.missile.play();

				var missile = new Missile(this.x - 40, this.y + 21, this.game.heli.x - this.game.background.back_x, this.game.heli.y, -5, this.game.missiles.length, this.game);
				this.game.collision_system.add(missile, missile.x - missile.leftEdge, missile.x + missile.rightEdge);
				this.game.missiles.push(missile);
			}

			this.wait--;
		}


	},

	collide: function(object){

		switch(object.type){

			case 2:
				this.game.collision_system.remove(object.collision_index);
				this.game.removeObject(this.game.bullets, object.gameIndex);

				this.health--;

				if(this.health === 0){
					//TODO: Play Explosion Sound
					this.game.collision_system.remove(this.collision_index);
					this.game.removeObject(this.game.enemy_helicopters, this.gameIndex)
					this.game.score += 10;
					Resource.Audio.explosion.play();
				}

				break;
			case 3:
				object.exploding = true;

				this.game.collision_system.remove(this.collision_index);
				this.game.removeObject(this.game.enemy_helicopters, this.gameIndex)
				this.game.score += 10;
				Resource.Audio.explosion.play();
				break;

		}

	}

}