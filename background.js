
var LEVEL_LENGTH = [3000, 6000, 6000]

// Background class
//----------------------------------
var Background = function(game, x, y) {
  this.game = game;
  this.back_x = x;
	this.mid_x = x;
	this.front_x = x;
};

Background.prototype = {


  render: function(context) {
    
    context.save();
    
    // Draw the background.
    context.drawImage(Resource.Image.levels[this.game.level], this.back_x, 0, 800, 480, 0, 0, 800, 480);
    
    // If mid_x is 3000, there is no longer a need to draw from the source twice.
    // Reset mid_x, allowing the render to draw from the beginning of the image again.
    if(this.mid_x >= LEVEL_LENGTH[this.game.level]){
      this.mid_x = 0;
    }
    
    // If out mid_x is past 2200, it will draw past the image.
    // Draw to the end of the image, and from there draw the beginning
    // of the image.
    if(this.mid_x > LEVEL_LENGTH[this.game.level] - 800){
      context.drawImage(Resource.Image.levels[this.game.level], this.mid_x, 480, LEVEL_LENGTH[this.game.level] - this.mid_x, 480, 0, 0, LEVEL_LENGTH[this.game.level] - this.mid_x, 480);
      context.drawImage(Resource.Image.levels[this.game.level], 0, 480, 800, 480, LEVEL_LENGTH[this.game.level] - this.mid_x, 0, 800, 480);
    }
    else{
      // Draw the mid ground.
      context.drawImage(Resource.Image.levels[this.game.level], this.mid_x, 480, 800, 480, 0, 0, 800, 480);
    }

    // If front_x is 3000, there is no longer a need to draw from the source twice.
    // Reset front_x, allowing the render to draw from the beginning of the image again.
    if(this.front_x >= LEVEL_LENGTH[this.game.level]){
      this.front_x = 0;
    }

    // If out front_x is past 2200, it will draw past the image.
    // Draw to the end of the image, and from there draw the beginning
    // of the image.
    if(this.front_x > LEVEL_LENGTH[this.game.level] - 800){
      context.drawImage(Resource.Image.levels[this.game.level], this.front_x, 960, LEVEL_LENGTH[this.game.level] - this.front_x, 480, 0, 0, LEVEL_LENGTH[this.game.level] - this.front_x, 480);
      context.drawImage(Resource.Image.levels[this.game.level], 0, 960, 800, 480, LEVEL_LENGTH[this.game.level] - this.front_x, 0, 800, 480);
    }
    else{
      // Draw the foreground.
      context.drawImage(Resource.Image.levels[this.game.level], this.front_x, 960, 800, 480, 0, 0, 800, 480);
    
    }
    
    context.restore();
	
  },
  
  update: function(){
    
    this.back_x += 5;
    this.mid_x += 8;
    this.front_x += 13;
    
  },
  
  nextLevel: function(){
    
    this.back_x = 0;
	  this.mid_x = 0;
	  this.front_x = 0;
    
  }
};