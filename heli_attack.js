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

  	this.targets = [];
  	this.missiles = [];
	
}
	
Game.prototype = {

	// Update the game world.  See
	// http://gameprogrammingpatterns.com/update-method.html
	update: function(elapsedTime) {
		var self = this;
		
		this.heli.update(elapsedTime, this.inputState);
		
		for(var i = 0; i < this.missiles.length; i++){
			this.missiles[i].update();

			if(this.missiles[i].x > 800){
				this.missiles.splice(i,1);
			}
		}

		for(var i = 0; i < this.targets.length; i++){

			if(this.targets[i].x >= this.background.back_x && this.targets[i].x <= this.background.back_x + 800){

				if(!this.targets[i].update()){
					this.targets.splice(i, 1);
				}

				for(var j = 0; j < this.missiles.length; j++){
					// Check collision between missile and balloon.
					if(this.targets[i].checkCollision(
						this.missiles[j].x + (24 * Math.cos(this.missiles[j].angle)), 
						this.missiles[j].y + (24 * Math.sin(this.missiles[j].angle)), this.background.back_x)){
						this.missiles.splice(j,1);
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

		// Render game objects
		this.heli.render(this.backBufferContext);

		for(var i = 0; i < this.targets.length; i++){
			this.targets[i].render(this.backBufferContext, this.background.back_x);	
		}

		// Render GUI
		this.gui.render();
		
		// Flip buffers
		this.screenContext.drawImage(this.backBuffer, 0, 0);
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
				break;
			case 2:
				if(e.clientX - this.canvasRect.left > this.heli.x + 45)
					this.missiles.push(this.heli.fireMissile(e.clientX - this.canvasRect.left, e.clientY - this.canvasRect.top, this.inputState));
				break;
		}

		return false;

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
		//window.onmouseup = function (e) { self.mouseUp(e);};
		
		
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
game.start();