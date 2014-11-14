// Screen Size
var WIDTH = 800;
var HEIGHT = 480;

// Fixed time step of 1/60th a second
var TIME_STEP = 1000/60;

var LEVEL_TWO_ENEMIES = [ [0, 1000], [1, 800], [2, 1200], [0, 2000], [1, 2250], [2, 2500], [1, 3000], [0, 4000], [2, 4000], [1, 4300], [1, 5000], [1, 5300], [0, 6300] ]
var LEVEL_THREE_ENEMIES = [ [0, 1000], [0, 2000], [2, 2500], [1, 3000], [0, 4000], [2, 4000], [1, 4300], [1, 5000], [1, 5300], [0, 6300] ] 

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
	this.turrets = [];
	this.tanks = [];
	this.boss = [];
	
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
      
			if(this.bullets[i].x > this.background.back_x + 800 || this.bullets[i].y <= -5){
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

		for(var i = 0; i < this.turrets.length; i++){
			this.turrets[i].update();
			this.collision_system.update(this.turrets[i].collision_index, this.turrets[i].x - this.turrets[i].leftEdge,
										this.turrets[i].x + this.turrets[i].rightEdge);
		}
		
		for(var i = 0; i < this.tanks.length; i++){
			this.tanks[i].update();
			this.collision_system.update(this.tanks[i].collision_index, this.tanks[i].x - this.tanks[i].leftEdge,
										this.tanks[i].x + this.tanks[i].rightEdge);
		}

		var allDead = true;

		for(var i = 0; i < this.boss.length; i++){
			this.boss[i].update();

			if(this.boss[i].health > 0){
				allDead = false;
			}
		}

		if(allDead){
			this.boss = [];
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

		if(this.background.back_x >= 2200 && this.level === 0){
			this.backBufferContext.drawImage(Resource.Image.helicopter_spritesheet, 130, 73, 130, 42, 655, 40, 130, 42);
		}
		else if(this.background.back_x >= 5200 && this.level > 0 && this.boss.length === 0){
			this.backBufferContext.drawImage(Resource.Image.helicopter_spritesheet, 130, 73, 130, 42, 655, 40, 130, 42);
		}
		
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

		for(i = 0; i < this.turrets.length; i++){
			this.turrets[i].render(this.backBufferContext);
		}

		for(i = 0; i < this.tanks.length; i++){
			this.tanks[i].render(this.backBufferContext);
		}

		for(var i = 0; i < this.boss.length; i++){
			this.boss[i].render(this.backBufferContext);
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


    for(var i = 0; i < this.balloons.length; i++){
    	this.collision_system.remove(this.balloons[i].collision_index);
    }
    for(var i = 0; i < this.missiles.length; i++){
    	this.collision_system.remove(this.missiles[i].collision_index);
    }
    for(var i = 0; i < this.bullets.length; i++){
    	this.collision_system.remove(this.bullets[i].collision_index);
    }
    for(var i = 0; i < this.tanks.length; i++){
    	this.collision_system.remove(this.tanks[i].collision_index);
    }
    for(var i = 0; i < this.turrets.length; i++){
    	this.collision_system.remove(this.turrets[i].collision_index);
    }
    for(var i = 0; i < this.enemy_helicopters.length; i++){
    	this.collision_system.remove(this.enemy_helicopters[i].collision_index);
    }
    for(var i = 0; i < this.power_ups.length; i++){
    	this.collision_system.remove(this.power_ups[i].collision_index);
    }

    this.power_ups = [];
	this.balloons = [];
	this.missles = [];
	this.bullets = [];
	this.tanks = [];
	this.turrets = [];
	this.enemy_helicopters = [];

	switch(this.level){

		case 1:

			for(var i = 0; i < LEVEL_TWO_ENEMIES.length; i++){

				switch(LEVEL_TWO_ENEMIES[i][0]){
					case 0:
						var h = new EnemyHelicopter(LEVEL_TWO_ENEMIES[i][1], 240, this.enemy_helicopters.length, this);
						this.collision_system.add(h, h.x - h.leftEdge, h.x + h.rightEdge);
						this.enemy_helicopters.push(h);
						break;
					case 1:
						var t = new Tank(LEVEL_TWO_ENEMIES[i][1], 436, this.tanks.length, this);
						this.collision_system.add(t, t.x - t.leftEdge, t.x + t.rightEdge);
						this.tanks.push(t);
						break;
					case 2:
						var tur = new Turret(LEVEL_TWO_ENEMIES[i][1], 400, this.turrets.length, this);
						this.collision_system.add(tur, tur.x - tur.leftEdge, tur.x + tur.rightEdge);
						this.turrets.push(tur);
						break;
				}

			}

			break;
		case 2:

			for(var i = 0; i < LEVEL_THREE_ENEMIES.length; i++){

				switch(LEVEL_THREE_ENEMIES[i][0]){
					case 0:
						var h = new EnemyHelicopter(LEVEL_THREE_ENEMIES[i][1], 240, this.enemy_helicopters.length, this);
						this.collision_system.add(h, h.x - h.leftEdge, h.x + h.rightEdge);
						this.enemy_helicopters.push(h);
						break;
					case 1:
						var t = new Tank(LEVEL_THREE_ENEMIES[i][1], 436, this.tanks.length, this);
						this.collision_system.add(t, t.x - t.leftEdge, t.x + t.rightEdge);
						this.tanks.push(t);
						break;
					case 2:
						var tur = new Turret(LEVEL_THREE_ENEMIES[i][1], 400, this.turrets.length, this);
						this.collision_system.add(tur, tur.x - tur.leftEdge, tur.x + tur.rightEdge);
						this.turrets.push(tur);
						break;
				}

			}

			var boss1 = new Boss(5927, 385, this.boss.length, this);
			this.collision_system.add(boss1, boss1.x - boss1.leftEdge, boss1.x + boss1.rightEdge);
			this.boss.push(boss1);

			var boss2 = new Boss(5927, 290, this.boss.length, this);
			this.collision_system.add(boss2, boss2.x - boss2.leftEdge, boss2.x + boss2.rightEdge);
			this.boss.push(boss2);

			var boss3 = new Boss(5927, 195, this.boss.length, this);
			this.collision_system.add(boss3, boss3.x - boss3.leftEdge, boss3.x + boss3.rightEdge);
			this.boss.push(boss3);

			var boss4 = new Boss(5927, 100, this.boss.length, this);
			this.collision_system.add(boss4, boss4.x - boss4.leftEdge, boss4.x + boss4.rightEdge);
			this.boss.push(boss4);

			break;
	}



	this.initBalloons();

	this.heli.nextLevel();
	this.background.nextLevel();
	
	  
	},

	initBalloons: function(){

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


	gameOverSplash: function(){

		this.gui.noRender();
		this.paused = true;

		this.screenContext.drawImage(Resource.Image.menu, 0, 0, 800, 480, 0, 0, 800, 480);
		this.screenContext.drawImage(Resource.Image.menu, 24, 591, 768, 133, 25, 70, 768, 133);
		this.screenContext.font = "100px Consolas";
		this.screenContext.fillText("GAME OVER", 150, 400);

		setTimeout(function(){game.gameOver = true;}, 4000);

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
		this.screenContext.fillText("www.bfxr.net", 150, 750 - this.creditsOffset);
		this.screenContext.fillText("Music:", 250, 850 - this.creditsOffset);
		this.screenContext.fillText("Underclocked", 200, 900 - this.creditsOffset);
		this.screenContext.fillText("by", 300, 950 - this.creditsOffset);
		this.screenContext.fillText("Eric Skiff", 200, 1000 - this.creditsOffset);
		this.screenContext.fillText("Music Under:", 250, 1100 - this.creditsOffset);
		this.screenContext.fillText("Creative Commons Liscense", 100, 1150 - this.creditsOffset);
		this.screenContext.fillText("The End!", 250, 1250 - this.creditsOffset);
		this.screenContext.fillText("Special Thanks:", 250, 1500 - this.creditsOffset);
		this.screenContext.fillText("Sean Meier", 300, 1550 - this.creditsOffset);
		this.screenContext.fillText("(╯°□°）╯︵ ┻━┻", 200, 2000 - this.creditsOffset);

		if(this.creditsOffset < 2500){
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