// Screen Size
var WIDTH = 800;
var HEIGHT = 480;

// Fixed time step of 1/60th a second
var TIME_STEP = 1000/60;

// Game class
//----------------------------------
var Game = function (canvasId) {
	var myself = this;
  
 	 // Rendering variables
  	this.screen = document.getElementById(canvasId);
  	this.canvasRect = this.screen.getBoundingClientRect();
  	this.screenContext = this.screen.getContext('2d');
  	this.backBuffer = document.createElement('canvas');
  	this.backBuffer.width = this.screen.width;
	this.backBuffer.height = this.screen.height;
 	this.backBufferContext = this.backBuffer.getContext('2d');
	
	this.inputState = {
		up: false,
		down: false,
		left: false,
		right: false
	};
	
  	// Game variables
	this.gui = new GUI(this);
  	this.heli = new Helicopter(this, 200, 200);
  	this.background = new Background(this, 0, 0);
	
	// TODO: Add enemies
  
  	// Timing variables
	this.elapsedTime = 0.0;
  	this.startTime = 0;
  	this.lastTime = 0;
  	this.gameTime = 0;
  	this.fps = 0;
  	this.STARTING_FPS = 60;

  	this.lives = 3;
  	this.health = 100;
  	this.num_missiles = 5;
  	this.score = 0;

  	this.targets = [];
  	this.missiles = [];
  	this.bullets = [];
	
	this.mouse_x;
	this.mouse_y;
	
	this.level = 0;
}
	
Game.prototype = {

	// Update the game world.  See
	// http://gameprogrammingpatterns.com/update-method.html
	update: function(elapsedTime) {
		var self = this;
		
		this.heli.update(elapsedTime, this.inputState);
		
		if(this.heli.x >= LEVEL_LENGTH[this.level] + 75)
		{
		  
		  //TODO: Add splash screen.
		  
		  //Load the next level.
		  this.nextLevel();

		  return;
		}
		
		for(var i = 0; i < this.bullets.length; i++){
			this.bullets[i].update();

			if(this.bullets[i].x > 800){
				this.bullets.splice(i, 1);
			}
		}

		// For each missle, update the position. If it explodes,
		// check to see if there are any targets near it.
		for(var i = 0; i < this.missiles.length; i++){
			
			if(this.missiles[i].update()){

				for(var j = 0; j < this.targets.length; j++){

					// If the target is on the screen, then it can be hit.
					if(this.targets[j].x >= this.background.back_x && this.targets[j].x <= this.background.back_x + 800){

						if(((this.missiles[i].x + 30) - (this.targets[j].x - this.background.back_x + 14)) * ((this.missiles[i].x + 30) - (this.targets[j].x - this.background.back_x + 14))
						 + ((this.missiles[i].y + 15) - (this.targets[j].y + 15)) * ((this.missiles[i].y + 15) - (this.targets[j].y + 15)) <= 1200 * 4){
							this.targets[j].exploding = true;
							this.targets[j].number_of_frames = 0;
						}
					}

				}

				this.missiles.splice(i,1);
			}
		}

		for(var i = 0; i < this.targets.length; i++){

			if(this.targets[i].x >= this.background.back_x && this.targets[i].x <= this.background.back_x + 800){

				if(!this.targets[i].update()){
					this.targets.splice(i, 1);
					this.score += 10;
				}

				for(var j = 0; j < this.missiles.length; j++){

					if(this.targets.length == 0){
						break;
					}

					// Check collision between missile and balloon.
					this.targets[i].checkCollision(
						this.missiles[j].x + (24 * Math.cos(this.missiles[j].angle)),
						this.missiles[j].y + (24 * Math.sin(this.missiles[j].angle)), this.background.back_x);

				}

				for(var j = 0; j < this.bullets.length; j++){

					if(this.targets.length == 0){
						break;
					}

					// Check collision between missile and balloon.
					if(this.targets[i].checkCollision(this.bullets[j].x, this.bullets[j].y, this.background.back_x)){
						this.bullets.splice(j, 1);
					}

				}

			}
		}


				
	},
	
	render: function(elapsedTime) {
		var self = this;
		
		// Clear the screen
		this.backBufferContext.fillRect(0, 0, WIDTH, HEIGHT);
		
		this.background.render(this.backBufferContext)
		
		for(var i = 0; i < this.missiles.length; i++){
			this.missiles[i].render(this.backBufferContext);
		}

		for(var i = 0; i < this.bullets.length; i++){
			this.bullets[i].render(this.backBufferContext);
		}

		// Render game objects
		this.heli.render(this.backBufferContext);

		for(var i = 0; i < this.targets.length; i++){
			this.targets[i].render(this.backBufferContext, this.background.back_x);
		}

		// Draw Reticule.
		this.renderReticule();

		// Render GUI
		this.gui.render();
		
		// Flip buffers
		this.screenContext.drawImage(this.backBuffer, 0, 0);
	},

	renderReticule: function(){
		this.backBufferContext.save();
		this.backBufferContext.translate(-11, -9);
		this.backBufferContext.drawImage(Resource.Image.helicopter_spritesheet, 14, 70, 22, 19, this.mouse_x, this.mouse_y, 22, 19);
		this.backBufferContext.restore();
	},
	
	keyDown: function(e)
	{
		// Cycle state is set directly
		switch(e.keyCode){
			case 37: // LEFT
				this.inputState.left = true;
				break;
			case 38: // UP
				this.inputState.up = true;
				break;
			case 39: // RIGHT
				this.inputState.right = true;
				break;
			case 40: // DOWN
				this.inputState.down = true;
				break;
		}
	},
	
	keyUp: function(e)
	{
		// Cycle state is set directly
		switch(e.keyCode){
			case 37: // LEFT
				this.inputState.left = false;
				break;
			case 38: // UP
				this.inputState.up = false;
				break;
			case 39: // RIGHT
				this.inputState.right = false;
				break;
			case 40: // DOWN
				this.inputState.down = false;
				break;
		}
	},

	onemousedown: function(e)
	{
		e.preventDefault();

		switch(e.button){
			case 0:
				this.bullets.push(this.heli.fireBullet(this.inputState));
				break;
			case 2:
				
				if(e.clientX - this.canvasRect.left > this.heli.x - this.background.back_x){
					if(this.num_missiles > 0){
						this.missiles.push(this.heli.fireMissile(e.clientX - this.canvasRect.left, e.clientY - this.canvasRect.top, this.inputState));
						this.num_missiles--;
					}
				}
				break;
		}

		return false;

	},
	
	nextLevel: function(){
	  
    this.level++;
	  
		this.targets = [];
		this.missles = [];
	  this.bullets = [];
	  
	  this.heli.nextLevel();
	  this.background.nextLevel();
	  
	},

	initTargets: function(){

		for(var i = 0; i < 10; i++){

			// Pick random x locations for the balloons.
			var x = (Math.random() * (800 - 200) + 200) + 220 * i;

			// Pick a y location between 10 and 450.
			var y = Math.random() * (450 - 10) + 10;

			// Randomly pick whether the balloon will begin by floating up, or floating down.
			var direction = Math.random() < 0.5;

			this.targets.push(new Target(x, y, direction));
		}

	},
	
	start: function() {
		var self = this;
    
		window.onkeydown = function (e) { self.keyDown(e); };
		window.onkeyup = function (e) { self.keyUp(e); };
		window.oncontextmenu = function () { return false; }
		window.onmousedown = function (e) { self.onemousedown(e);};
		window.onmousemove = function (e) { self.mouse_x = e.clientX - self.canvasRect.left; self.mouse_y = e.clientY - self.canvasRect.top;};
	
		this.initTargets();

		this.startTime = Date.now();
		
		window.requestNextAnimationFrame(
			function(time) {
				self.loop.call(self, time);
			}
		);
	},
	
	// The game loop.  See
	// http://gameprogrammingpatterns.com/game-loop.html
	loop: function(time) {
		var self = this;
		
		// Don't advance the clock if the game is paused
		if(this.paused || this.gameOver) this.lastTime = time;
		
		// Calculate additional elapsed time, keeping any
		// unused time from previous frame
		this.elapsedTime += time - this.lastTime;
		this.lastTime = time;
		
		// The first timestep (and occasionally later ones) are too large
		// causing our processing to take too long (and run into the next
    	// frame).  We can clamp to a max of 4 frames to keep that from
    	// happening
		this.elapsedTime = Math.min(this.elapsedTime, 4 * TIME_STEP);
		
		//console.log(this.elapsedTime);
		
		// We want a fixed game loop of 1/60th a second, so if necessary run multiple
		// updates during each rendering pass
		// Invariant: We have unprocessed time in excess of TIME_STEP
		while (this.elapsedTime >= TIME_STEP) {
			self.update(TIME_STEP);
			this.elapsedTime -= TIME_STEP;
			
			// add the TIME_STEP to gameTime
			this.gameTime += TIME_STEP;
		}
		
		// We only want to render once
		self.render(this.elapsedTime);
		
		// Repeat the game loop
		window.requestNextAnimationFrame(
			function(time) {
				self.loop.call(self, time);
			}
		);
	}
}

var game = new Game('game');
console.log(game);
function waitForLoad() {
	if(Resource.loading === 0) {
		game.start();
	} else {
		setTimeout(waitForLoad, 1000);
	}
};
waitForLoad();