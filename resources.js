var NUM_OF_LEVELS = 3;

// Resources
//----------------------------------
Resource = {
	loading: 6,
	Image: {
		helicopter_spritesheet: new Image(),
		enemy_spritesheet: new Image(),
		balloon_spritesheet: new Image(),
		levels: [new Image(), new Image(), new Image()],
	}
}
function onload() {
	console.log("Loaded", this);
	Resource.loading -= 1;
}

Resource.Image.helicopter_spritesheet.onload = onload;
Resource.Image.enemy_spritesheet.onload = onload;
Resource.Image.balloon_spritesheet.onload = onload;

Resource.Image.helicopter_spritesheet.src = "helicopter_spritesheet.png";
Resource.Image.enemy_spritesheet.src = "enemy_spritesheet.png";
Resource.Image.balloon_spritesheet.src = "balloon_spritesheet.png";

for(var i = 0; i < NUM_OF_LEVELS; i++){
  
  Resource.Image.levels[i].onload = onload;
  Resource.Image.levels[i].src = "level_" + (i + 1) + ".png";
  
}
