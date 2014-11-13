// GUI class
//----------------------------------
var GUI = function(game) {
	this.game = game;
	
	// GUI panels
	this.topLeft = document.getElementById("gui-top-left");
	this.topCenter = document.getElementById("gui-top-center");
	this.topRight = document.getElementById("gui-top-right");
	this.bottomLeft = document.getElementById("gui-bottom-left");
	this.bottomCenter = document.getElementById("gui-bottom-center");
	this.bottomRight = document.getElementById("gui-bottom-right");
	this.minimapCanvas = document.getElementById("minimap");
	this.minimapContext = this.minimapCanvas.getContext('2d');
	this.minimap = new Image();
  	this.minimap.src = "minimap.png";

	this.render = function() {

		// Render Health
		this.bottomLeft.innerHTML = "Health: " + this.game.heli.health + "%";

		// Render Lives
		this.topLeft.innerHTML = "Lives: " + this.game.heli.lives;

		// Render Missiles
		this.topCenter.innerHTML = "Missiles: " + this.game.heli.missiles;

		// Render Score
		this.topRight.innerHTML = "Score: " + this.game.score;

		// Render mini-map (Extra Credit)

		this.minimapContext.fillStyle = "#FFFFFF";
		this.minimapContext.fillRect(0, 0, 800, 100);
		this.minimapCanvas.width = this.minimapCanvas.width;


		this.minimapContext.drawImage(this.minimap, 0, 0, 800, 100, 0, 0, 800, 100);

		this.minimapContext.strokeStyle = "#000000";
		this.minimapContext.fillStyle = "#00CC00";
		this.minimapContext.beginPath();
		this.minimapContext.arc(800 * (this.game.background.back_x + this.game.heli.x) / 3000, 100 * this.game.heli.y / 480, 3, 0, 2*Math.PI, false);
		this.minimapContext.fill();
		this.minimapContext.stroke();
		this.minimapContext.strokeStyle = "#000000";
		this.minimapContext.rect(800 * this.game.background.back_x / 3000, 0, 213, 100);
		this.minimapContext.stroke();

	}
}