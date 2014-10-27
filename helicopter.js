
// Helicopter class
//----------------------------------
var Helicopter = function(game, x, y) {
  this.game = game;
  this.x = x;
	this.y = y;
  this.velocity = 1;
	this.health = 100;
  this.pitch_angle = 0;
	this.turret_angle = 0;
	this.animation_frame = 0;
	this.number_of_frames = 0;
	this.missiles = 3;
	this.sprite_sheet = new Image();
	this.sprite_sheet.src = "helicopter_sheet.png";
};

Helicopter.prototype = {
	x: 0,
	y: 0,
	velocity: 0,
	
	render: function(context) {
		// Render helicopter with pitch angle, missiles, and targeted turret
		context.save();
		context.translate(this.x, this.y);
		context.rotate(this.pitch_angle);
		//Center at rotor.
		//context.translate(-65, -4);
		context.translate(-75, -20);
		context.save();
		context.translate(90, 35);
		context.rotate(this.turret_angle);
		//context.drawImage(this.sprite_sheet, 100, 56, 25, 8, -5, 0, 25, 8);
		context.restore();
		//context.drawImage(this.sprite_sheet, 0, 0, 131, 52, 0, 0, 131, 52);
		context.drawImage(this.sprite_sheet, 128 * this.animation_frame, 0, 125, 65, 0, 0, 125, 65);
		context.translate(56, 35);
		for(i = 0; i < this.missiles; i++) {
			context.translate(2,2);
		  context.drawImage(this.sprite_sheet, 75, 56, 17, 8, 0, 0, 17, 8);
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
			//Rubber banding
			if(this.x <= 200 ||this.game.background.back_x >= 2200){
			 this.x += this.velocity * 5;
			}
		  else{
		    if(this.game.background.back_x < 2200)
		    {
		      this.game.background.update();
		    }
		  }
		} else {
			this.pitch_angle = 0;
		}
	}
};