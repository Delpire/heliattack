
var Bullet = function(x, y, velocity, gameIndex, game){

	this.type = 2;

	this.x = x;
	this.y = y;
	this.velocity = velocity;
	this.radius = 1;
	this.game = game;
	this.gameIndex = gameIndex;
	this.topEdge = this.radius;
	this.bottomEdge = this.radius;
	this.leftEdge = this.radius;
	this.rightEdge = this.radius + 10;
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
		this.x += this.velocity;
	},
	
	collide: function(object){
	  
	  switch(object.type){
	    
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
			}
	    	break;
	    
	  }
	  
	}

}