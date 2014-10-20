
// Background class
//----------------------------------
var Background = function(game, x, y) {
  this.game = game;
  this.back_x = x;
	this.mid_x = x;
	this.front_x = x;
	this.sprite_sheet = new Image();
  this.sprite_sheet.src = "sprite_sheet.png";
};

Background.prototype = {


  render: function(context) {
    
    context.save();
    context.drawImage(this.sprite_sheet, this.back_x, 0, 800, 480, 0, 0, 800, 480);
    context.drawImage(this.sprite_sheet, this.mid_x, 480, 800, 480, 0, 0, 800, 480);
    
    if(this.mid_x > 2200){
      context.drawImage(this.sprite_sheet, this.mid_x, 480, 800, 480, 0, 0, 800, 480);
      context.drawImage(this.sprite_sheet, 0, 480, 800, 480, 3000 - this.mid_x, 0, 800, 480);
    }
    if(this.mid_x == 3000){
      this.mid_x = 0;
    }
    
    context.drawImage(this.sprite_sheet, this.front_x, 960, 800, 480, 0, 0, 800, 480);
    
    if(this.front_x > 2200){
      context.drawImage(this.sprite_sheet, this.front_x, 960, 800, 480, 0, 0, 800, 480);
      context.drawImage(this.sprite_sheet, 0, 960, 800, 480, 3000 - this.front_x, 0, 800, 480);
    }
    if(this.front_x == 3000){
      this.front_x = 0;
    }
    
    context.restore();
	
  },
  
  update: function(){
    
    this.back_x += 2;
    this.mid_x += 5;
    this.front_x += 10;
    
    
  }
  
  

};