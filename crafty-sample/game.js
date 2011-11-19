window.onload = function () {
    //start crafty
    Crafty.init(400, 336);
    //Crafty.canvas();

    //turn the sprite map into usable components
    Crafty.sprite(16, "sprite.png", {
        grass1: [0, 0],
        grass2: [1, 0],
        grass3: [2, 0],
        grass4: [3, 0],
        flower: [0, 1],
        bush1: [0, 2],
        bush2: [1, 2],
        player: [0, 3],
        enemy: [0, 3],
        banana: [4, 0],
        empty: [4, 0]
    });
     function generateWorld() {
        //loop through all tiles
        for (var i = 0; i < 25; i++) {
            for (var j = 0; j < 21; j++) {

                //place grass on all tiles
                grassType = Crafty.randRange(1, 4);
                Crafty.e("2D, DOM, grass" + grassType)
                    .attr({ x: i * 16, y: j * 16, z:1 });
                //grid of bushes
                if((i % 2 === 0) && (j % 2 === 0)) {
                    Crafty.e("2D, DOM, solid, bush1")
                        .attr({x: i * 16, y: j * 16, z: 2000})
                }

                //create a fence of bushes
                if(i === 0 || i === 24 || j === 0 || j === 20)
                    Crafty.e("2D, DOM, solid, bush" + Crafty.randRange(1, 2))
                    .attr({ x: i * 16, y: j * 16, z: 2 });

                //generate some nice flowers within the boundaries of the outer bushes
                if (i > 0 && i < 24 && j > 0 && j < 20
                        && Crafty.randRange(0, 50) > 30
                        && !(i === 1 && j >= 16)
                        && !(i === 23 && j <= 4)) {
                    var f = Crafty.e("2D, DOM, flower, Collision, solid, SpriteAnimation, explodable")
                            .attr({ x: i * 16, y: j * 16, z: 1000 })
                            .animate("wind", 0, 1, 3)
                            .animate('wind', 80, -1)
                            .bind('explode', function() {
                                this.destroy();
                            })
                            .collision();
                    if(f.hit('solid')) {
                        f.destroy();
                    }
                }
            }
        }
    }
    
        Crafty.c('Ape', {
        Ape: function() {
                //setup animations
                this.requires("SpriteAnimation, Collision")
                .animate("walk_left", 6, 3, 8)
                .animate("walk_right", 9, 3, 11)
                .animate("walk_up", 3, 3, 5)
                .animate("walk_down", 0, 3, 2)
                //change direction when a direction change event is received
                .bind("NewDirection",
                    function (direction) {
                        if (direction.x < 0) {
                            if (!this.isPlaying("walk_left"))
                                this.stop().animate("walk_left", 10, -1);
                        }
                        if (direction.x > 0) {
                            if (!this.isPlaying("walk_right"))
                                this.stop().animate("walk_right", 10, -1);
                        }
                        if (direction.y < 0) {
                            if (!this.isPlaying("walk_up"))
                                this.stop().animate("walk_up", 10, -1);
                        }
                        if (direction.y > 0) {
                            if (!this.isPlaying("walk_down"))
                                this.stop().animate("walk_down", 10, -1);
                        }
                        if(!direction.x && !direction.y) {
                            this.stop();
                        }
                })
                // A rudimentary way to prevent the user from passing solid areas
                .bind('Moved', function(from) {
                	console.log(this);
                    if(this.hit('solid')){
                        this.attr({x: from.x, y:from.y});
                    }
                }).onHit("fire", function() {
                    this.destroy();
                });
            return this;
        }
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
     //the loading screen that will display while our assets load
    Crafty.scene("loading", function () {
        //load takes an array of assets and a callback when complete
        Crafty.load(["sprite.png"], function () {
            Crafty.scene("main"); //when everything is loaded, run the main scene
        });

        //black background with some loading text
        Crafty.background("#000");
        Crafty.e("2D, DOM, Text").attr({ w: 100, h: 20, x: 150, y: 120 })
                .text("Loading")
                .css({ "text-align": "center" });
    });

    //automatically play the loading scene
    Crafty.scene("loading");
    Crafty.scene("main", function () {
        generateWorld();
        var player1 = Crafty.e("2D, DOM, Ape, player, LeftControls, BombDropper")
                .attr({ x: 16, y: 304, z: 1 })
                .leftControls(1)
                .Ape();
		var player2 = Crafty.e("2D, DOM, Ape, player, RightControls, BombDropper")
				.attr({ x: 368, y: 16, z: 1 })
				.rightControls(1)
				//.bombDropper(Crafty.keys.ENTER)
				.Ape();
	});
    
}