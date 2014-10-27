
var Target = function(x, y, direction){
	this.x = x;
	this.y = y;
	this.original_y = y;
	this.number_of_frames = 0;
	this.moving_up = direction;
	this.sprite_sheet = new Image();
	this.sprite_sheet.src = "balloon.png";
}

Target.prototype = {

	render: function(context, world_x){
		context.drawImage(this.sprite_sheet, 0, 0, 30, 72, this.x - world_x, this.y, 30, 72);
	},

	update: function(){

		this.number_of_frames++;

		if(this.number_of_frames == 2){

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

			this.number_of_frames = 0;
		}

	}



}