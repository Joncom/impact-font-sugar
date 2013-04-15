ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
	'plugins.joncom.border-font'
)
.defines(function(){

MyGame = ig.Game.extend({

	clearColor: '#666666',

	// Load a font
	originalFont: new ig.Font('media/04b03.font.png'),
	borderFont1: new ig.BorderFont('media/04b03.font.png'),
	borderFont2: new ig.BorderFont('media/04b03.font.png', { borderColor: '#00FF00' }),
	borderFont3: new ig.BorderFont('media/04b03.font.png', { borderColor: '#0000FF', fillCorners: false }),
	borderFont4: new ig.BorderFont('media/04b03.font.png', { borderColor: '#FFF', fontColor: '#F00', letterSpacing: 0 }),
	borderFont5: new ig.BorderFont('media/04b03.font.png', { borderColor: '#FF00FF', borderSize: 3 }),

	init: function() {
		// Initialize your game here; bind keys etc.
	},

	update: function() {
		// Update all entities and backgroundMaps
		this.parent();

		// Add your own, additional update code here
	},

	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();


		// Add your own drawing code here
		var x = ig.system.width/2,
			y = 10;

			this.originalFont.draw( 'The quick brown fox jumped over the lazy dog!', x, y, ig.Font.ALIGN.CENTER );
			this.borderFont1.draw( 'The quick brown fox jumped over the lazy dog!', x, y+15, ig.Font.ALIGN.CENTER );
			this.borderFont2.draw( 'The quick brown fox jumped over the lazy dog!', x, y+30, ig.Font.ALIGN.CENTER );
			this.borderFont3.draw( 'The quick brown fox jumped over the lazy dog!', x, y+45, ig.Font.ALIGN.CENTER );
			this.borderFont4.draw( 'The quick brown fox jumped over the lazy dog!', x, y+60, ig.Font.ALIGN.CENTER );
			this.borderFont5.draw( 'The quick brown fox jumped over the lazy dog!', x, y+75, ig.Font.ALIGN.CENTER );
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 120, 2 );

});
