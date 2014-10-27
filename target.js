
var Target = function(x, y, direction){
	this.x = x;
	this.y = y;
	this.original_y = y;
	this.number_of_frames = 0;
	this.frame_index = 0;
	this.moving_up = direction;
	this.exploding = false;
	this.sprite_sheet = new Image();
	this.sprite_sheet.src = "balloon_sheet.png";
}

Target.prototype = {

	render: function(context, world_x){
		context.drawImage(this.sprite_sheet, this.frame_index * 30, 0, 30, 72, this.x - world_x, this.y, 30, 72);
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

	}



}