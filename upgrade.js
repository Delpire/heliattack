
var Upgrade = function(upgrade, x, y, gameIndex, game){
  this.type = 1;
  this.x = x;
  this.y = y;
  this.upgrade = upgrade;
  this.topEdge = 12;
  this.bottomEdge = 12;
  this.leftEdge = 12;
  this.rightEdge = 12;
  this.left_index;
  this.right_index;
  this.collision_index;
  this.game = game;
  this.gameIndex = gameIndex;

};

Upgrade.prototype = {
  
  render: function(context){
    
    context.drawImage(Resource.Image.upgrade_spritesheet, this.upgrade * 25, 0, 25, 25, this.x - game.background.back_x, this.y, 25, 25);
  },
  
  collide: function(object){
    
    switch(object.type){
	    
	    case 0:
	      
	      switch(this.upgrade){
	        
	        case 0:
	          object.health += 10;
            Resource.Audio.upgrade.play();
	          break;
          case 1:
            object.missiles += 3;
            Resource.Audio.upgrade.play();
            break;
          case 2:
            object.lives++;
            Resource.Audio.upgrade.play();
            break;
          case 3:
            Resource.Audio.explosion.play();
            object.health -= 10;

            if(object.health <= 0 && object.lives > 0){
              object.lives--;
              object.health = 100;
            }
            else if(object.health <= 0 && object.lives <= 0){
              this.game.gameOverSplash();
            }
            break;
	      }
	      
	      this.game.collision_system.remove(this.collision_index);
	      this.game.removeObject(this.game.power_ups, this.gameIndex);

	      break;
      case -1:
        break;
    }
  }
  
};