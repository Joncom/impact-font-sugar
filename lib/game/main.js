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
    text: 'The [#000000 quick] brown fox jumped over the lazy dog!',

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
    otherFont: new ig.Font('media/04b03.font.png', { fontColor: '#98FB98' }),

    draw: function() {
        this.parent();

        // Draw fonts.
        var x = ig.system.width/2;
        var y = 10;
        this.originalFont.draw( this.text, x, y, ig.Font.ALIGN.CENTER );
        this.font1.draw( this.text, x, y+15, ig.Font.ALIGN.CENTER );
        this.font2.draw( this.text, x, y+30, ig.Font.ALIGN.CENTER );
        this.font3.draw( this.text, x, y+45, ig.Font.ALIGN.CENTER );
        this.font4.draw( this.text, x, y+60, ig.Font.ALIGN.CENTER );
        this.font5.draw( this.text, x, y+75, ig.Font.ALIGN.CENTER );
        this.font6.draw( this.text, x, y+90, ig.Font.ALIGN.CENTER );
        this.font7.draw( this.text, x, y+105, ig.Font.ALIGN.CENTER );
        this.font8.draw( this.text, x, y+120, ig.Font.ALIGN.CENTER );

        this.otherFont.draw(
            "[#FFFFFF Keep society clean!] \n" +
            "You can [#FFF838 hold Shoot] and release once you \n" +
            "[#FFF838 flash quickly] to fire a very powerful blast!",
            10,
            y+155
        );
    }

});


ig.main( '#canvas', MyGame, 60, 340, 210, 2 );

});
