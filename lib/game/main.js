ig.module(
    'game.main'
)
.requires(
    'impact.game',
    'impact.font',
    'plugins.joncom.font-borders'
)
.defines(function(){

MyGame = ig.Game.extend({

    clearColor: '#666666',

    // Load fonts.
    originalFont: new ig.Font('media/04b03.font.png'),
    font1: new ig.Font('media/04b03.font.png', { borderColor: '#000' }),
    font2: new ig.Font('media/04b03.font.png', { borderColor: '#FFF', fontColor: '#000' }),
    font3: new ig.Font('media/04b03.font.png', { borderColor: '#1B8200' }),
    font4: new ig.Font('media/04b03.font.png', { borderColor: '#284CA2' }),
    font5: new ig.Font('media/04b03.font.png', { borderColor: '#9D1625' }),
    font6: new ig.Font('media/04b03.font.png', { borderColor: '#1B8200', borderSize: 2, letterSpacing: 1 }),
    font7: new ig.Font('media/04b03.font.png', { borderColor: '#284CA2', borderSize: 3, letterSpacing: 2 }),
    font8: new ig.Font('media/04b03.font.png', { borderColor: '#9D1625', borderSize: 4, letterSpacing: 4 }),

    draw: function() {
        this.parent();

        // Draw fonts.
        var x = ig.system.width/2;
        var y = 10;
        var text = 'The quick brown fox jumped over the lazy dog!';
        this.originalFont.draw( text, x, y, ig.Font.ALIGN.CENTER );
        this.font1.draw( text, x, y+15, ig.Font.ALIGN.CENTER );
        this.font2.draw( text, x, y+30, ig.Font.ALIGN.CENTER );
        this.font3.draw( text, x, y+45, ig.Font.ALIGN.CENTER );
        this.font4.draw( text, x, y+60, ig.Font.ALIGN.CENTER );
        this.font5.draw( text, x, y+75, ig.Font.ALIGN.CENTER );
        this.font6.draw( text, x, y+90, ig.Font.ALIGN.CENTER );
        this.font7.draw( text, x, y+105, ig.Font.ALIGN.CENTER );
        this.font8.draw( text, x, y+120, ig.Font.ALIGN.CENTER );
    }

});


ig.main( '#canvas', MyGame, 60, 340, 160, 2 );

});
