
var Upgrade = function(upgrade, x, y){
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

};

Upgrade.prototype = {
  
  render: function(context){
    
    context.drawImage(Resource.Image.upgrade_spritesheet, this.upgrade * 25, 0, 25, 25, this.x - game.background.back_x, this.y, 25, 25);
  },
  
  collide: function(){
    
  }
  
};