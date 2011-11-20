Crafty.c("enemy", {
			init: function() {
				this.origin("center");
				this.attr({
					x: Crafty.randRange(0, Crafty.viewport.width), //give it random positions, rotation and speed
					x: Crafty.randRange(0, Crafty.viewport.height),
					xspeed: Crafty.randRange(1, 5), 
					yspeed: Crafty.randRange(1, 5), 
					rspeed: Crafty.randRange(-5, 5)
				}).bind("EnterFrame", function() {
					this.x += this.xspeed;
					this.y += this.yspeed;
					this.rotation += this.rspeed;
					
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
				}).collision()
				.onHit("bullet", function(e) {
					//if hit by a bullet increment the score
					player.score += 5;
					score.text("Score: "+player.score);
					e[0].obj.destroy(); //destroy the bullet
					
					this.destroy();
					return;
					
					var oldxspeed = this.xspeed;
					this.xspeed = -this.yspeed;
					this.yspeed = oldxspeed;
					
					
				});
				
			}
		});