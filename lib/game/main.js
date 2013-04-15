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

	// Load fonts.
	originalFont: new ig.Font('media/04b03.font.png'),
	borderFont1: new ig.BorderFont('media/04b03.font.png'),
	borderFont2: new ig.BorderFont('media/04b03.font.png', { borderColor: '#1B8200' }),
	borderFont3: new ig.BorderFont('media/04b03.font.png', { borderColor: '#284CA2' }),
	borderFont4: new ig.BorderFont('media/04b03.font.png', { borderColor: '#9D1625' }),
	borderFont5: new ig.BorderFont('media/04b03.font.png', { borderColor: '#FFF', fontColor: '#000' }),
	borderFont6: new ig.BorderFont('media/04b03.font.png', { borderColor: '#1B8200', borderSize: 2, letterSpacing: 1 }),
	borderFont7: new ig.BorderFont('media/04b03.font.png', { borderColor: '#284CA2', borderSize: 3, letterSpacing: 2 }),
	borderFont8: new ig.BorderFont('media/04b03.font.png', { borderColor: '#9D1625', borderSize: 4, letterSpacing: 4 }),

	draw: function() {
		this.parent();

	    // Draw fonts.
	    var x = ig.system.width/2;
	    var y = 10;
		this.originalFont.draw( 'The quick brown fox jumped over the lazy dog!', x, y, ig.Font.ALIGN.CENTER );
		this.borderFont1.draw( 'The quick brown fox jumped over the lazy dog!', x, y+15, ig.Font.ALIGN.CENTER );
		this.borderFont2.draw( 'The quick brown fox jumped over the lazy dog!', x, y+30, ig.Font.ALIGN.CENTER );
		this.borderFont3.draw( 'The quick brown fox jumped over the lazy dog!', x, y+45, ig.Font.ALIGN.CENTER );
		this.borderFont4.draw( 'The quick brown fox jumped over the lazy dog!', x, y+60, ig.Font.ALIGN.CENTER );
		this.borderFont5.draw( 'The quick brown fox jumped over the lazy dog!', x, y+75, ig.Font.ALIGN.CENTER );
		this.borderFont6.draw( 'The quick brown fox jumped over the lazy dog!', x, y+90, ig.Font.ALIGN.CENTER );
		this.borderFont7.draw( 'The quick brown fox jumped over the lazy dog!', x, y+105, ig.Font.ALIGN.CENTER );
		this.borderFont8.draw( 'The quick brown fox jumped over the lazy dog!', x, y+120, ig.Font.ALIGN.CENTER );
	}
});


ig.main( '#canvas', MyGame, 60, 340, 160, 2 );

});
