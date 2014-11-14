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
	
	this.gameState = "loading";

	this.inputState = {
		up: false,
		down: false,
		left: false,
		right: false
	};
	
	this.collision_system = new CollisionSystem();
	
  	// Game variables
	this.gui = new GUI(this);
	this.heli = new Helicopter(this, 200, 200);
	this.collision_system.add(this.heli, this.heli.x - this.heli.rightEdge, this.heli.x + this.heli.leftEdge);
	this.background = new Background(this, 0, 0);
	
	// TODO: Add enemies
  
  	// Timing variables
  this.elapsedTime = 0.0;
	this.startTime = 0;
	this.lastTime = 0;
	this.gameTime = 0;
	this.fps = 0;
	this.STARTING_FPS = 60;

	this.balloons = [];
	this.missiles = [];
	this.bullets = [];
	this.power_ups = [];
	this.enemy_helicopters = [];
	
	this.score = 0;
	
	this.mouse_x;
	this.mouse_y;
	
	this.level = 0;

	this.creditsOffset = 0;
}
	
Game.prototype = {

	// Update the game world.  See
	// http://gameprogrammingpatterns.com/update-method.html
	update: function(elapsedTime) {
		var self = this;
		
		this.heli.update(elapsedTime, this.inputState);
		this.collision_system.update(this.heli.collision_index, this.heli.x - this.heli.leftEdge, this.heli.x + this.heli.rightEdge);
		
		if(this.heli.x >= LEVEL_LENGTH[this.level] + 75)
		{
		  //Load the next level.
		  this.nextLevel();
		  return;
		}
		
		for(var i = 0; i < this.bullets.length; i++){
			this.bullets[i].update();
			this.collision_system.update(this.bullets[i].collision_index, this.bullets[i].x - this.bullets[i].leftEdge,
			                                  this.bullets[i].x + this.bullets[i].rightEdge);
      
			if(this.bullets[i].x > this.background.back_x + 800){
			 	this.collision_system.remove(this.bullets[i].collision_index);
				this.removeObject(this.bullets, i);
			}
		}

		// For each missle, update the position. If it explodes,
		// check to see if there are any balloons near it.
		for(var i = 0; i < this.missiles.length; i++){
			
			this.collision_system.update(this.missiles[i].collision_index, this.missiles[i].x - this.missiles[i].leftEdge,
			                                  this.missiles[i].x + this.missiles[i].rightEdge);

			if(this.missiles[i].update()){
				this.collision_system.remove(this.missiles[i].collision_index);
				this.removeObject(this.missiles, this.missiles[i].gameIndex);
			}
		}

		for(var i = 0; i < this.balloons.length; i++){

			if(this.balloons[i].x >= this.background.back_x && this.balloons[i].x <= this.background.back_x + 800){

				if(!this.balloons[i].update()){
				  	this.spawnPowerUp(this.balloons[i].x, this.balloons[i].y);
					this.removeObject(this.balloons, this.balloons[i].gameIndex);
					this.score += 10;
				}
			}
		}

		for(var i = 0; i < this.enemy_helicopters.length; i++){
			this.enemy_helicopters[i].update();
			this.collision_system.update(this.enemy_helicopters[i].collision_index, this.enemy_helicopters[i].x - this.enemy_helicopters[i].leftEdge,
										this.enemy_helicopters[i].x + this.enemy_helicopters[i].rightEdge);
		}
		
		var collisions = this.collision_system.checkCollisions();
		
		if(collisions.length == 2){
		  console.log("two");
		}
		
		for(var i = 0; i < collisions.length; i++){
		
		    if(collisions[i][0].y - collisions[i][0].topEdge > collisions[i][1].y - collisions[i][1].topEdge &&
		        collisions[i][0].y - collisions[i][0].topEdge < collisions[i][1].y + collisions[i][1].bottomEdge){
		      collisions[i][0].collide(collisions[i][1]);
		    }
		    else if(collisions[i][0].y + collisions[i][0].bottomEdge > collisions[i][1].y - collisions[i][1].topEdge &&
		            collisions[i][0].y + collisions[i][0].bottomEdge < collisions[i][1].y + collisions[i][1].bottomEdge){
		      collisions[i][0].collide(collisions[i][1]);
		    }
		}

		collisions = [];
		
	},
	
	render: function(elapsedTime) {
		var self = this;
		
		// Clear the screen
		this.backBufferContext.fillRect(0, 0, WIDTH, HEIGHT);
		
		this.background.render(this.backBufferContext)
		
		for(var i = 0; i < this.missiles.length; i++){
			this.missiles[i].render(this.backBufferContext);
		}

		for(i = 0; i < this.bullets.length; i++){
			this.bullets[i].render(this.backBufferContext);
		}

		// Render game objects
		this.heli.render(this.backBufferContext);

		for(i = 0; i < this.balloons.length; i++){
			this.balloons[i].render(this.backBufferContext, this.background.back_x);
		}
		
		for(i = 0; i < this.power_ups.length; i++){
		  this.power_ups[i].render(this.backBufferContext);
		}

		for(i = 0; i < this.enemy_helicopters.length; i++){
			this.enemy_helicopters[i].render(this.backBufferContext);
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
					if(this.heli.missiles > 0){
						this.missiles.push(this.heli.fireMissile(e.clientX - this.canvasRect.left, e.clientY - this.canvasRect.top, this.inputState));
						this.heli.missiles--;
					}
				}
				break;
		}

		return false;

	},
	
	nextLevel: function(){
	  
    this.level++;

    this.gui.noRender();

    if(this.level == 3){
    	this.paused = true;
    	this.gameOver = true;
    	return;
    }
	
    this.transitionLevel();

	this.balloons = [];
	this.missles = [];
	this.bullets = [];

	this.initBalloons();

	this.heli.nextLevel();
	this.background.nextLevel();
	
	  
	},

	initBalloons: function(){

		//REMOVE
		var h = new EnemyHelicopter(400, 240, this.enemy_helicopters.length, this);
		this.collision_system.add(h, h.x - h.leftEdge, h.x + h.rightEdge);
		this.enemy_helicopters.push(h);
		//REMOVE


		for(var i = 0; i < 18 / (this.level + 1); i++){

			// Pick random x locations for the balloons.
			var x = Math.floor((Math.random() * (800 - 200) + 200 * (i + 1) * (this.level + 1) ));

			// Pick a y location between 20 and 350.
			var y = Math.floor(Math.random() * (350 - 10) + 20);

			// Randomly pick whether the balloon will begin by floating up, or floating down.
			var direction = Math.random() < 0.5;

      var balloon = new Balloon(x, y, direction, this.balloons.length, this);
      this.collision_system.add(balloon, x - balloon.leftEdge, x + balloon.rightEdge);
			this.balloons.push(balloon);
		}

	},
	
	spawnPowerUp: function(x, y){
	  
	  var upgradeIndex = Math.floor((Math.random() * 5)) - 1;
	  
	  if(upgradeIndex == -1)
	    return;

    var upgrade = new Upgrade(upgradeIndex, x, y, this.power_ups.length, this);
	  
	  this.power_ups.push(upgrade);
	  this.collision_system.add(upgrade, x - upgrade.leftEdge, x + upgrade.rightEdge);
	},
	
	removeObject: function(array, index){
	  
	  for(var i = index + 1; i < array.length; i++){
	    array[i].gameIndex--;
	  }
	  
	  array.splice(index, 1);
	  
	},

	transitionLevel: function(){

		this.screenContext.drawImage(Resource.Image.menu, 0, 0, 800, 480, 0, 0, 800, 480);
		this.screenContext.drawImage(Resource.Image.menu, 7 + 198 * this.level, 738, 188, 51, 100, 350, 188, 51);
		this.screenContext.font = "50px Consolas";
		this.screenContext.fillText("Score: " + this.score, 425, 388);
		this.screenContext.drawImage(Resource.Image.menu, 7 + 198 * this.level, 738, 188, 51, 100, 350, 188, 51);

		this.paused = true;

		setTimeout(function(){game.paused = false;}, 2000);

	},

	playCredits: function(){

		this.screenContext.fillStyle = 'black';
		this.screenContext.fillRect(0, 0, 800, 480);
		this.screenContext.fillStyle = 'white';
		this.screenContext.font = "50px Consolas";
		this.screenContext.fillText("HeliAttack", 250, 300 - this.creditsOffset);
		this.screenContext.fillText("Created By:", 250, 400 - this.creditsOffset);
		this.screenContext.fillText("Chris Delpire", 200, 450 - this.creditsOffset);
		this.screenContext.fillText("Art By:", 250, 550 - this.creditsOffset);
		this.screenContext.fillText("Robin Delpire", 200, 600 - this.creditsOffset);
		this.screenContext.fillText("Sound Effects:", 250, 700 - this.creditsOffset);
		this.screenContext.fillText("The Sound Program", 150, 750 - this.creditsOffset);
		this.screenContext.fillText("Music:", 250, 850 - this.creditsOffset);
		this.screenContext.fillText("A Song", 200, 900 - this.creditsOffset);
		this.screenContext.fillText("by", 300, 950 - this.creditsOffset);
		this.screenContext.fillText("An Artist", 200, 1000 - this.creditsOffset);
		this.screenContext.fillText("Music Under:", 250, 1100 - this.creditsOffset);
		this.screenContext.fillText("Creative Commons Liscense", 100, 1150 - this.creditsOffset);
		this.screenContext.fillText("The End!", 250, 1250 - this.creditsOffset);
		this.screenContext.fillText("Special Thanks:", 250, 1500 - this.creditsOffset);
		this.screenContext.fillText("Sean Meier", 300, 1550 - this.creditsOffset);
		this.screenContext.fillText("for distractions...", 200, 2000 - this.creditsOffset);

		if(this.creditsOffset < 2000){
			this.creditsOffset = this.creditsOffset + 2;
		}
	},
	
	start: function() {
		var self = this;
    
		window.onkeydown = function (e) { self.keyDown(e); };
		window.onkeyup = function (e) { self.keyUp(e); };
		window.oncontextmenu = function () { return false; }
		window.onmousedown = function (e) { self.onemousedown(e);};
		window.onmousemove = function (e) { self.mouse_x = e.clientX - self.canvasRect.left; self.mouse_y = e.clientY - self.canvasRect.top;};
	
		this.initBalloons();

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
		if(!this.gameOver){
			while (this.elapsedTime >= TIME_STEP) {
				self.update(TIME_STEP);
				this.elapsedTime -= TIME_STEP;
				
				// add the TIME_STEP to gameTime
				this.gameTime += TIME_STEP;
			}
		}

		// We only want to render once
		if(!this.paused) self.render(this.elapsedTime);
		if(this.gameOver) self.playCredits();
		
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

	//var screen = document.getElementById(canvasId);
	//var screenContext = this.screen.getContext('2d');
	game.screenContext.drawImage(Resource.Image.menu, 0, 0, 800, 480, 0, 0, 800, 480);
	game.screenContext.drawImage(Resource.Image.menu, 0, 480, 800, 120, 200, 325, 800, 120);

	if(Resource.loading === 0) {
		setTimeout(displaySplash, 2000);
	} else {
		setTimeout(waitForLoad, 1000);
	}
}


function displaySplash(){

	game.screenContext.drawImage(Resource.Image.menu, 0, 0, 800, 480, 0, 0, 800, 480);
	game.screenContext.drawImage(Resource.Image.menu, 7, 738, 188, 51, 300, 350, 188, 51);

	setTimeout(play, 2000);
}

function play(){
	game.start();
}
waitForLoad();