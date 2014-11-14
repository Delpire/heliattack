
var Balloon = function(x, y, direction, gameIndex, game){
	this.type = 4;
	this.gameIndex = gameIndex;
	this.game = game;
	
	this.x = x;
	this.y = y;
	this.original_y = y;
	this.number_of_frames = 0;
	this.frame_index = 0;
	this.moving_up = direction;
	this.exploding = false;
	
	// Collision Detals
  this.topEdge = -4;
  this.bottomEdge = 30;
  this.leftEdge = -4;
  this.rightEdge = 25;
  this.left_index;
  this.right_index;
  this.collision_index;
}

Balloon.prototype = {

	render: function(context, world_x){
		context.drawImage(Resource.Image.balloon_spritesheet, this.frame_index * 30, 0, 30, 72, this.x - world_x, this.y, 30, 72);
	},

	update: function(){

		this.number_of_frames++;

		if(this.number_of_frames == 2){

			// If the balloon is not exploding, then just bob up and down.
			// Otherwise, play the exploding animation.
			if(!this.exploding){
				if(this.moving_up){

					this.y--;

					if(this.y <= this.original_y - 15){
						this.moving_up = false;
					}
				}
				else{
					this.y++;

					if(this.y >= this.original_y + 15){
						this.moving_up = true;
					}
				}
			}
			else{
				this.frame_index++;

				if(this.frame_index == 3){
					return false;
				}

				this.number_of_frames = 0;
			}

			this.number_of_frames = 0;
		}

		return true;
	},

	checkCollision: function(x, y, world_x){

		center_x = this.x - world_x + 14;
		center_y = this.y + 16;

		if(x >= center_x - 10 && x <= center_x + 11 && y <= center_y + 13 && y >= center_y - 13){
			this.exploding = true;
			this.number_of_frames = 0;
			return true;
		}

		return false;

	},
	
	collide: function(object){
	  
	  switch(object.type){
	    
	    //Spawn power up and remove Balloon and Bullet.
	    case 2:
	      this.game.spawnPowerUp(this.x, this.y);

	      this.game.collision_system.remove(this.collision_index);
	      this.game.collision_system.remove(object.collision_index);
	      this.game.removeObject(this.game.bullets, object.gameIndex);
        this.game.removeObject(this.game.balloons, this.gameIndex);
	      
	      break;
	    case 3:
	      break;
	    
	  }
	  
	}
	
}