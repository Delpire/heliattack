
var Bullet = function(x, y, velocity_x, velocity_y, gameIndex, game){

	this.type = 2;

	this.x = x;
	this.y = y;
	this.velocity_x = velocity_x;
	this.velocity_y = velocity_y;
	this.radius = 1;
	this.game = game;
	this.gameIndex = gameIndex;
	this.topEdge = this.radius + 5;
	this.bottomEdge = this.radius + 5;
	this.leftEdge = this.radius + 5;
	this.rightEdge = this.radius + 5;
	this.left_index;
	this.right_index;
	this.collision_index;


}

Bullet.prototype = {

	render: function(context){

		context.save();
		context.strokeStyle = "#000000";
		context.fillStyle = "#aaaaaa";
		context.beginPath();
		context.arc(this.x - this.game.background.back_x, this.y, this.radius, 0, 2*Math.PI, false);
		context.fill();
		context.stroke();
		context.restore();

	},

	update: function(){
		this.x += this.velocity_x;
		this.y += this.velocity_y;
	},
	
	collide: function(object){
	  
	  switch(object.type){
	    
	    case 0:

	  		Resource.Audio.explosion.play();

  		 	this.game.collision_system.remove(this.collision_index);
	      	this.game.removeObject(this.game.bullets, this.gameIndex);

      		object.health -= 10;

      		if(object.health <= 0 && object.lives > 0){
      			object.lives--;
      			object.health = 100;
      		}
      		else if(object.health <= 0 && object.lives <= 0){
      			this.game.gameOverSplash();
      		}

	    	break;
	    //Spawn power up and remove Balloon and Bullet.
	    case 4:
	      	this.game.collision_system.remove(this.collision_index);
     	 	this.game.collision_system.remove(object.collision_index);
        	this.game.removeObject(this.game.bullets, this.gameIndex);
	      	
	      	object.exploding = true;
			object.number_of_frames = 0;
	      	break;
	    case 5:
			this.game.collision_system.remove(this.collision_index);
			this.game.removeObject(this.game.bullets, this.gameIndex)

			object.health--;

			if(object.health === 0){
				//TODO: Play Explosion Sound
				this.game.collision_system.remove(object.collision_index);
				this.game.removeObject(this.game.enemy_helicopters, object.gameIndex);
				this.game.score += 10;
				Resource.Audio.explosion.play();
			}
	    	break;
	    case 6:
	      	this.game.collision_system.remove(this.collision_index);
     	 	this.game.collision_system.remove(object.collision_index);
        	this.game.removeObject(this.game.bullets, this.gameIndex);
        	this.game.removeObject(this.game.turrets, object.gameIndex);
        	this.game.score += 10;
			Resource.Audio.explosion.play();
	      	break;

	    
	  }
	  
	}

}