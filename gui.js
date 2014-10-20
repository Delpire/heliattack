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
	
	this.render = function() {
		// TODO: Render Health
		// TODO: Render Lives
		// TODO: Render Missiles
		// TODO: Render Score
		// TODO: Render mini-map (Extra Credit)
	}
}