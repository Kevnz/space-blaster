window.onload = function () {
	Crafty.init();
	Crafty.canvas.init();
	
	//preload the needed assets
	Crafty.load(["images/fighter.png", "images/bg.png"], function() {
		//splice the spritemap
		Crafty.sprite(64, "images/fighter.png", {
			ship: [3,0]
		});
		
		//start the main scene when loaded
		Crafty.scene("main");
	});
    Crafty.c("LeftControls", {
        init: function() {
            this.requires('Multiway');
        },
       leftControls: function(speed) {
            this.multiway(speed, {W: -90, S: 90, D: 0, A: 180})
            return this;
        }   });
        
    Crafty.c('RightControls', {
    	init: function(){
    		this.requires('Multiway');
    	},
    	rightControls: function(speed){
    		this.multiway(speed, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180});
    		return this;
    	}
    });
    
    Crafty.scene("main", function() {
		Crafty.background("url('images/bg.png')");
		
		
		Crafty.c('RightControls', {
	    	init: function(){
	    		this.requires('Multiway');
	    	},
	    	rightControls: function(speed){
	    		this.multiway(speed, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180});
	    		return this;
	    	}
	    });
		Crafty.c('BlasterFire', {

			init: function() {
				console.log('init bf')
			},
			blasterFire: function(key) {
				console.log(key);
				Crafty.e("2D, DOM, Color, bullet")
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
				this._key = key;
				return this;
			} 
    });


 
	    
		var player = Crafty.e("2D, DOM, Canvas, ship, Controls, Collision, SpriteAnimation, RightControls,BlasterFire") 
			.attr({move: {left: false, right: false, up: false, down: false}, xspeed: 0, yspeed: 0, decay: 0.9, 
				x: Crafty.viewport.width / 2, y: Crafty.viewport.height - 122, score: 0})
			.origin("center")
			.animate("fly_left", 3, 3, 0)
			.animate("fly_right", 3, 3, 6)
			.rightControls(4)
			.blasterFire(Crafty.keys.ENTER)
			;
		
	});
}