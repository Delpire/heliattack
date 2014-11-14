var Turret = function(x, y, gameIndex, game){

	this.type = 6;
	this.game = game;
	this.gameIndex = gameIndex;

	this.x = x;
	this.y = y;

	this.topEdge = 0;
	this.bottomEdge = 84;
	this.leftEdge = 0;
	this.rightEdge = 82;
	this.left_index;
	this.right_index;
	this.collision_index;

	this.wait = 0;

	this.state = 0;
}

Turret.prototype = {

	render: function(context){
		context.drawImage(Resource.Image.enemy_spritesheet, 136, 3, 82, 84, this.x - this.game.background.back_x, this.y, 82, 84);
	},

	update: function(){

		if(this.x > this.game.heli.x && this.x < this.game.heli.x + 800 && this.wait <= 0){

			Resource.Audio.bullet.play();

			bulletOne = new Bullet(this.x + 6, this.y - 13, -5, -5, this.game.bullets.length, this.game);
			this.game.collision_system.add(bulletOne, bulletOne.x - bulletOne.leftEdge, bulletOne.x + bulletOne.rightEdge);
			this.game.bullets.push(bulletOne);

			bulletTwo = new Bullet(this.x - 13, this.y + 5, -5, -5, this.game.bullets.length, this.game);
			this.game.collision_system.add(bulletTwo, bulletTwo.x - bulletTwo.leftEdge, bulletTwo.x + bulletTwo.rightEdge);
			this.game.bullets.push(bulletTwo);

			bulletThree = new Bullet(this.x + 16, this.y - 13, -5, -5, this.game.bullets.length, this.game);
			this.game.collision_system.add(bulletThree, bulletThree.x - bulletThree.leftEdge, bulletThree.x + bulletThree.rightEdge);
			this.game.bullets.push(bulletThree);

			this.wait = 50;
		}

		this.wait--;
	},

	collide: function(){

		switch(object.type){

			case 2:
				this.game.collision_system.remove(object.collision_index);
				this.game.removeObject(this.game.bullets, object.gameIndex);

				this.game.collision_system.remove(this.collision_index);
				this.game.removeObject(this.game.turrets, this.gameIndex)
				this.game.score += 10;
				Resource.Audio.explosion.play();

				break;
			case 3:
				object.exploding = true;

				this.game.collision_system.remove(this.collision_index);
				this.game.removeObject(this.game.turrets, this.gameIndex)
				this.game.score += 10;
				Resource.Audio.explosion.play();
				break;

		}

	}
}