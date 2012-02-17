window.onload = function() {
	Crafty.init();
	Crafty.canvas.init();
	var totalScore = 0;
	//preload the needed assets
	Crafty.load(["images/fighter.png", "images/bg.png", 'images/bad-guy.png'], function() {
		//splice the spritemap
		Crafty.sprite(64, "images/fighter.png", {
			ship: [3, 0]
		});
		Crafty.sprite(32, "images/bad-guy.png", {
			enemyShip: [0, 0]
		});
		//start the main scene when loaded
		Crafty.scene("main");
	});
	Crafty.c("LeftControls", {
		init: function() {
			this.requires('Multiway');
		},
		leftControls: function(speed) {
			this.multiway(speed, {
				W: -90,
				S: 90,
				D: 0,
				A: 180
			})
			return this;
		}
	});

	Crafty.c('RightControls', {
		init: function() {
			this.requires('Multiway');
		},
		rightControls: function(speed) {
			this.multiway(speed, {
				UP_ARROW: -90,
				DOWN_ARROW: 90,
				RIGHT_ARROW: 0,
				LEFT_ARROW: 180
			});
			return this;
		}
	});

	Crafty.scene("main", function() {
		var score = Crafty.e("2D, DOM, Text")
			.text("Score: 0")
			.attr({x: Crafty.viewport.width - 300, y: Crafty.viewport.height - 50, w: 200, h:50})
			.css({color: "#fff"});
		var pause = Crafty.e("2D, DOM, Text")
				.text("Pause")
				.attr({x: 150, y: Crafty.viewport.height - 50, w: 200, h:50})
				.css({color: "#fff"});	
		Crafty.background("url('images/bg.png')");

		Crafty.c('RightControls', {
			init: function() {
				this.requires('Multiway');
			},
			rightControls: function(speed) {
				this.multiway(speed, {
					UP_ARROW: -90,
					DOWN_ARROW: 90,
					RIGHT_ARROW: 0,
					LEFT_ARROW: 180
				});
				return this;
			}
		});
		Crafty.c('BlasterFire', {
 			_key: Crafty.keys.SPACE,
			init: function() { 
				this.requires('Grid')
				.bind('KeyDown', function(e) {
					console.log('keydown--')
	                if (e.key !== this._key) {
	                    return;
	                }
					
					var bul = Crafty.e("2D, DOM, Color, bullet")
						.attr({
							x: this._x + 32, 
							y: this._y, 
							w: 2, 
							h: 7, 
							rotation: 0, 
							xspeed: 0, 
							yspeed: 5
						})
						.color("rgb(255, 0, 0)")
						.bind("EnterFrame", function() {

							this.x += this.xspeed;
							this.y -= this.yspeed;
							
							//destroy if it goes out of bounds
							if(this._x > Crafty.viewport.width || this._x < 0 || this._y > Crafty.viewport.height || this._y < 0) {
								this.destroy();
							}
						});
				});
			},
	        blasterFire: function(key) {
	            this._key = key;
	            return this;
	        }

		});
 
		Crafty.c('Starship', {
			Starship: function() {
				console.log('Starship');
				//setup animations
				this.requires("SpriteAnimation, Collision, Grid, Keyboard")
				.animate("fly_left", 3, 0, 0)
				.animate("fly_right", 3, 0, 6)
				.animate("level_out", 0, 0, 0)
				.bind("NewDirection", function(direction) {
					return;
					console.log(direction.x + ' ' + direction.y);
					if (direction.x < 0) {
						if (!this.isPlaying("fly_left")) this.stop().animate("fly_left", 10, 0);
					}
					if (direction.x > 0) {
						if (!this.isPlaying("fly_right")) this.stop().animate("fly_right", 10, 0);
					}
					if (direction.x===0 && direction.y===0) {
						console.log('yup')
						this.stop().animate("level_out", 10, 0);
					}
					if (direction.y < 0) {
 
					}
					if (!direction.x && !direction.y) {
						this.stop();
					}
				})
				.bind('Moved', function(from) {
					if(this.y <= 460){
						this.attr({y:460});
						return;
					}
					if(this.hit('solid')){
						this.attr({x: from.x, y:from.y});
					}
				})
				.bind('keydown', function(){
					console.log('keydowned');
					var bul = Crafty.e("2D, DOM, Color, bullet")
						.attr({
							x: this._x, 
							y: this._y, 
							w: 2, 
							h: 5, 
							rotation: this._rotation, 
							xspeed: 20 * Math.sin(this._rotation / 57.3), 
							yspeed: 20 * Math.cos(this._rotation / 57.3)
						})
						.color("rgb(255, 0, 0)")
						.bind("enterframe", function() {	
							this.x += this.xspeed;
							this.y -= this.yspeed;
							
							//destroy if it goes out of bounds
							if(this._x > Crafty.viewport.width || this._x < 0 || this._y > Crafty.viewport.height || this._y < 0) {
								this.destroy();
							}
						});
						console.log(bul);
				}).onHit('enemy', function(){
					console.log('hit me with your best shot')
				});
				return this;
			}
		});
		
 
			Crafty.c("Enemy", {
						Enemy: function() {
							this.requires("2D, DOM, SpriteAnimation, Collision, Grid, Keyboard")
							.origin("center")
							.attr({
								x: Crafty.randRange(200, 1200), //give it random positions, rotation and speed
								y: 0,
								xspeed: 0, 
								yspeed: 3
							}).bind("EnterFrame", function() {
								this.x += this.xspeed;
								this.y += this.yspeed; 

								if(this._x > Crafty.viewport.width) {
									this.x = -64;
								}
								if(this._x < -64) {
									this.x =  Crafty.viewport.width;
								}
								if(this._y > Crafty.viewport.height) {
									this.y = -64;
								}
								if(this._y < -64) {
									this.y = Crafty.viewport.height;
								}
							}) 
							
							this.onHit("bullet", function(e) {
								//if hit by a bullet increment the score
								totalScore += 5;
								score.text("Score: "+totalScore);
								e[0].obj.destroy(); //destroy the bullet

								this.destroy();
								return;

								var oldxspeed = this.xspeed;
								this.xspeed = -this.yspeed;
								this.yspeed = oldxspeed;


							}); 
						/*	*/

						}
					});
 
		var player = Crafty.e("2D, DOM, Canvas, ship, Starship, Controls, Collision, SpriteAnimation, RightControls, BlasterFire, Keyboard").attr({
			move: {
				left: false,
				right: false,
				up: false,
				down: false
			},
			xspeed: 0,
			yspeed: 0,
			decay: 0.9,
			x: Crafty.viewport.width / 2,
			y: Crafty.viewport.height - 122,
			score: 0
		}).origin("center").bind('keydown', function() {
			console.log('key');
		}).rightControls(4)
		.blasterFire(Crafty.keys.SPACE)
		.Starship();
		var badGuy = Crafty.e('2D, DOM, enemyShip, Enemy, Collision, SpriteAnimation').Enemy();
		
		var addEnemy = function(){
			setTimeout( function(){
				Crafty.e('2D, DOM, enemyShip, Enemy, Collision, SpriteAnimation').Enemy();

				addEnemy();
			}, Crafty.randRange(1000, 5000) );
		}
		addEnemy();

	});
}
