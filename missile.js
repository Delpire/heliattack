
FLAME_FRAMES = [ [385, 76, 6, 5, 4, 2], [393, 75, 10, 6, 8, 1], [405, 75, 8, 6, 7, 1]];

var Missile = function(x, y, mouse_x, mouse_y, velocity, gameIndex, game){
	this.type = 3;
	this.gameIndex = gameIndex;
	this.game = game;
	
	this.x = x;
	this.y = y;
	this.target_x = mouse_x + this.game.background.back_x;
	this.target_y = mouse_y;
	this.angle = Math.atan( (mouse_y - y) / (this.target_x - x))
	this.frame_index = 0;
	this.number_of_frames = 0;
	this.explode = false;

	this.velocity = velocity;
	
	// Collision Detals
	this.topEdge = 25 * Math.sin(this.angle);
	this.bottomEdge = 0;
	this.leftEdge = 10;
	this.rightEdge = 25 * Math.cos(this.angle);
	this.left_index;
	this.right_index;
	this.collision_index;
}

Missile.prototype = {

	render: function(context){

		context.save();
		context.translate(this.x - this.game.background.back_x, this.y - 4);
		context.rotate(this.angle);
		if(this.velocity < 0){
			context.scale(-1,1);
		}
		if(this.explode){
			context.drawImage(Resource.Image.helicopter_spritesheet, 419, 83, 33, 29, 0, 0, 33, 29);
		}
		else{
			context.drawImage(Resource.Image.helicopter_spritesheet, FLAME_FRAMES[this.frame_index][0], FLAME_FRAMES[this.frame_index][1],
				FLAME_FRAMES[this.frame_index][2], FLAME_FRAMES[this.frame_index][3],
				0 - FLAME_FRAMES[this.frame_index][4], 0 + FLAME_FRAMES[this.frame_index][5],
				FLAME_FRAMES[this.frame_index][2], FLAME_FRAMES[this.frame_index][3]);
			context.drawImage(Resource.Image.helicopter_spritesheet, 423, 74, 26, 8, 0, 0, 26, 8);
		}
		context.restore();
	},

	update: function(){
		
		this.number_of_frames++;

		if(this.explode)
		{
			this.topEdge = 100;
			this.bottomEdge = 100;
			this.leftEdge = 100;
			this.rightEdge = 100;

			// After the explode sprite has shown for a few frames then
			// return true telling the game to delete the missile object.
			if(this.number_of_frames == 10){
				return true;
			}
		}
		else{
			this.x += this.velocity * Math.cos(this.angle);
			this.y += this.velocity * Math.sin(this.angle);

			if(this.number_of_frames == 10){
				this.frame_index = (this.frame_index + 1) % 3;
				this.number_of_frames = 0;
			}

			if(Math.abs(this.target_x - this.x) < 5 && Math.abs(this.target_y - this.y) < 5){
				this.explode = true;
				Resource.Audio.explosion.play();
				this.number_of_frames = 0;
			}
		}

		return false;
	},
	
	collide: function(object){
	  
	  switch(object.type){
	    
	  	case 0:

	  		Resource.Audio.explosion.play();

  		 	this.game.collision_system.remove(this.collision_index);
	      	this.game.removeObject(this.game.missiles, this.gameIndex);

      		object.health -= 10;

      		if(object.health <= 0 && object.lives > 0){
      			object.lives--;
      			object.health = 100;
      		}
      		else if(object.health <= 0 && object.lives <= 0){
      			this.game.gameOverSplash();
      		}

	  		break;

	    //Spawn power up and remove Balloon and Missile.
	    case 4:
     	 	this.game.collision_system.remove(object.collision_index);	      
	      	object.exploding = true;
			object.number_of_frames = 0;
	      	break;
	    case 5:
			this.game.collision_system.remove(object.collision_index);
			this.game.removeObject(this.game.enemy_helicopters, object.gameIndex);

			object.exploding = true;
			this.game.score += 10;
			Resource.Audio.explosion.play();
	    	break;
	    case 6:
	      	this.game.collision_system.remove(this.collision_index);
     	 	this.game.collision_system.remove(object.collision_index);
        	this.game.removeObject(this.game.missiles, this.gameIndex);
        	this.game.removeObject(this.game.turrets, object.gameIndex);
        	this.game.score += 10;
			Resource.Audio.explosion.play();
	      	break;
	    
	  }
	  
	}

}