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
				}

				break;
			case 3:
				this.game.collision_system.remove(object.collision_index);
				this.game.removeObject(this.game.missiles, object.gameIndex);

				this.game.collision_system.remove(this.collision_index);
				this.game.removeObject(this.game.enemy_helicopters, this.gameIndex)
				this.game.score += 10;
				break;

		}

	}

}