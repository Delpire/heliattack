
// Helicopter class
//----------------------------------
var Helicopter = function(game, x, y) {
  	this.type = 0;
  	this.game = game;
 	  this.x = x;
	  this.y = y;
  	this.velocity = 1;
	  this.health = 100;
  	this.pitch_angle = 0;
	  this.turret_angle = Math.PI / 8;
	  this.animation_frame = 0;
	  this.number_of_frames = 0;
	  this.missiles = 5;
	  this.lives = 3;
	  this.topEdge = 0;
	  this.bottomEdge = 28;
	  this.leftEdge = 76;
	  this.rightEdge = 37;
	  this.left_index;
	  this.right_index;
	  this.collision_index;
};

Helicopter.prototype = {
	x: 0,
	y: 0,
	velocity: 0,
	
	render: function(context) {
		// Render helicopter with pitch angle, missiles, and targeted turret
		context.save();
		context.translate(this.x - this.game.background.back_x, this.y);
		context.rotate(this.pitch_angle);
		//Center at rotor.
		context.translate(-75, -20);
		context.save();
		context.translate(71, 50);
		context.rotate(this.turret_angle);
		context.drawImage(Resource.Image.helicopter_spritesheet, 330, 77, 21, 20, 0, 0, 21, 20);
		context.restore();
		context.drawImage(Resource.Image.helicopter_spritesheet, 128 * this.animation_frame, 0, 125, 65, 0, 0, 125, 65);
		context.translate(56, 35);
		for(i = 0; i < this.missiles; i++) {
			context.translate(2,2);
		  context.drawImage(Resource.Image.helicopter_spritesheet, 75, 56, 17, 8, 0, 0, 17, 8);
		}
		context.restore();
	},
	
	update: function(elapsedTime, inputState) {
	  
		// Move the helicopter
		this.move(inputState);
		
		this.number_of_frames++;
		
		if(this.number_of_frames == 2){
		  this.animation_frame = (this.animation_frame + 1) % 4;
		  this.number_of_frames = 0;
		}
		
		// TODO: Fire weapons
	
	},
	
	move: function(inputState) {
		if(inputState.up) {
			this.y -= this.velocity * 2;
		} else if(inputState.down) {
			this.y += this.velocity * 5;
		}
		if(inputState.left) {
			this.pitch_angle = -Math.PI/10;
			this.x -= this.velocity * 2;
		} else if(inputState.right) {
		  
			this.pitch_angle = Math.PI/8;
			this.x += this.velocity * 5;
			//Rubber banding
			if(this.x - this.game.background.back_x <= 200 ||this.game.background.back_x >= LEVEL_LENGTH[this.game.level] - 800){
			 
			}
		  else{
		    if(this.game.background.back_x < LEVEL_LENGTH[this.game.level] - 800)
		    {
		      this.game.background.update();
		    }
		  }
		} else {
			this.pitch_angle = 0;
		}

		if(this.game.mouse_x >= this.x && this.game.mouse_y >= this.y){

			this.turret_angle = Math.atan((this.game.mouse_y - this.y) / (this.game.mouse_x - this.x)) - .6;
		}

	},

	fireMissile: function(mouse_x, mouse_y, inputState){

		// If the player is moving forward, then the missile needs to start at
		// a different location to account for the tilted barrel.
		if(inputState.right){
		  
		  missile = new Missile(this.x - 25 - this.game.background.back_x, this.y + 25, mouse_x, mouse_y, this.game.missiles.length, this.game)
		  this.game.collision_system.add(missile, missile.x - missile.leftEdge, missile.y + missile.rightEdge)
		  return missile;
		}

		// If the player is moving backward, then the missile needs to start at
		// a different location to account for the tilted barrel.
		if(inputState.left){
		  
		  missile = new Missile(this.x - 25 - this.game.background.back_x, this.y + 25, mouse_x, mouse_y, this.game.missiles.length, this.game)
		  this.game.collision_system.add(missile, missile.x - missile.leftEdge, missile.y + missile.rightEdge)
		  return missile;
		}
		
		missile = new Missile(this.x - this.game.background.back_x, this.y + 30, mouse_x, mouse_y, this.game.missiles.length, this.game)
	  this.game.collision_system.add(missile, missile.x - missile.leftEdge, missile.y + missile.rightEdge)
	  return missile;
	},

	fireBullet: function(inputState){
    
    var bullet;
    
		// If the player is moving forward, then the bullet needs to start at
		// a different location to account for the tilted barrel.
		if(inputState.right){
		  bullet = new Bullet(this.x + 25, this.y + 30, 10, this.game.bullets.length, this.game);
		  this.game.collision_system.add(bullet, bullet.x - bullet.leftEdge, bullet.x + bullet.rightEdge);
			return bullet;
		}

		// If the player is moving backward, then the bullet needs to start at
		// a different location to account for the tilted barrel.
		if(inputState.left){
		  
		  bullet = new Bullet(this.x + 25, this.y + 3, 10, this.game.bullets.length, this.game);
		  this.game.collision_system.add(bullet, bullet.x - bullet.leftEdge, bullet.x + bullet.rightEdge);
			return bullet;
		}
	
	  bullet = new Bullet(this.x + 25, this.y + 16, 10, this.game.bullets.length, this.game);
	  this.game.collision_system.add(bullet, bullet.x - bullet.leftEdge, bullet.x + bullet.rightEdge);
		return bullet;
	},
	
	collide: function(object){
	  
	  switch(object.type){
	    
	    case 1:
	      
	      switch(object.upgrade){
	        
	        case 0:
	          this.health += 10;
	          break;
          case 1:
            this.missiles += 3;
            break;
          case 2:
            this.lives++;
            break;
          case 3:
            this.health -= 10;
            break;
	      }
	      
	      this.game.collision_system.remove(object.collision_index);
	      this.game.removeObject(this.game.power_ups, object.gameIndex);

	      break;
      case -1:
        break;
	    
	    
	  }
	  
	  
	},
	
	nextLevel: function(){
    this.x = 200;
    this.y = 200;
	  
	}
};