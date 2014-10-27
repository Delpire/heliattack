
FLAME_FRAMES = [ [385, 76, 6, 5, 4, 2], [393, 75, 10, 6, 8, 1], [405, 75, 8, 6, 7, 1]]; 

var Missile = function(x, y, mouse_x, mouse_y){
	this.x = x;
	this.y = y;
	this.target_x = mouse_x;
	this.target_y = mouse_y;
	this.angle = Math.atan( (mouse_y - y) / (mouse_x - x))
	this.frame_index = 0;
	this.number_of_frames = 0;
	this.sprite_sheet = new Image();
	this.sprite_sheet.src = "helicopter_sheet.png";
	this.explode = false;
}

Missile.prototype = {

	render: function(context){

		context.save();
		context.translate(this.x, this.y - 4);
		context.rotate(this.angle);
		if(this.explode){
			context.drawImage(this.sprite_sheet, 419, 83, 33, 29, 0, 0, 33, 29);
		}
		else{
			context.drawImage(this.sprite_sheet, FLAME_FRAMES[this.frame_index][0], FLAME_FRAMES[this.frame_index][1], 
				FLAME_FRAMES[this.frame_index][2], FLAME_FRAMES[this.frame_index][3], 
				0 - FLAME_FRAMES[this.frame_index][4], 0 + FLAME_FRAMES[this.frame_index][5], 
				FLAME_FRAMES[this.frame_index][2], FLAME_FRAMES[this.frame_index][3]);
			context.drawImage(this.sprite_sheet, 423, 74, 26, 8, 0, 0, 26, 8);
		}
		context.restore();
	},

	update: function(){
		
		this.number_of_frames++;

		if(this.explode)
		{
			// After the explode sprite has shown for a few frames then
			// return true telling the game to delete the missile object.
			if(this.number_of_frames == 10){
				return true;
			}
		}
		else{
			this.x += 5 * Math.cos(this.angle);
			this.y += 5 * Math.sin(this.angle);

			if(this.number_of_frames == 10){
				this.frame_index = (this.frame_index + 1) % 3;
				this.number_of_frames = 0;
			}

			if(Math.abs(this.target_x - this.x) < 5 && Math.abs(this.target_y - this.y) < 5){
				this.explode = true;
				this.number_of_frames = 0;
			}	
		}

		return false;
	}

}