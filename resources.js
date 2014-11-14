var NUM_OF_LEVELS = 3;

// Resources
//----------------------------------
Resource = {
	loading: 8,
	Image: {
		helicopter_spritesheet: new Image(),
		enemy_spritesheet: new Image(),
		balloon_spritesheet: new Image(),
		upgrade_spritesheet: new Image(),
		levels: [new Image(), new Image(), new Image()],
		menu: new Image(),
	},
	Audio: {
		music: new Audio(),
		upgrade: new Audio(),
		explosion: new Audio(),
		bullet: new Audio(),
		missile: new Audio(),
	}
}
function onload() {
	console.log("Loaded", this);
	Resource.loading -= 1;
}

Resource.Image.menu.onload = onload;
Resource.Image.menu.src = "menu.png";

Resource.Audio.music.onload = onload;
Resource.Audio.music.src = "music.mp3";
Resource.Audio.music.volume = 0.5;
Resource.Audio.music.loop = true;
Resource.Audio.music.play();

Resource.Audio.upgrade.onload = onload;
Resource.Audio.upgrade.src = "upgrade_audio.wav";
Resource.Audio.upgrade.volume = 0.25;

Resource.Audio.explosion.onload = onload;
Resource.Audio.explosion.src = "explosion_audio.wav";
Resource.Audio.explosion.volume = 0.25;

Resource.Audio.bullet.onload = onload;
Resource.Audio.bullet.src = "bullet_audio.wav";
Resource.Audio.bullet.volume = 1;

Resource.Audio.missile.onload = onload;
Resource.Audio.missile.src = "missile_audio.wav";
Resource.Audio.missile.volume = 0.75;

Resource.Image.helicopter_spritesheet.onload = onload;
Resource.Image.enemy_spritesheet.onload = onload;
Resource.Image.balloon_spritesheet.onload = onload;
Resource.Image.upgrade_spritesheet.onload = onload;

Resource.Image.helicopter_spritesheet.src = "helicopter_spritesheet.png";
Resource.Image.enemy_spritesheet.src = "enemy_spritesheet.png";
Resource.Image.balloon_spritesheet.src = "balloon_spritesheet.png";
Resource.Image.upgrade_spritesheet.src = "upgrade_spritesheet.png";

for(var i = 0; i < NUM_OF_LEVELS; i++){
  
  Resource.Image.levels[i].onload = onload;
  Resource.Image.levels[i].src = "level_" + (i + 1) + ".png";
  
}
