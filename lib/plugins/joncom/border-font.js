ig.module('plugins.joncom.border-font')
.requires('impact.font')
.defines(function() {

    "use strict";

    ig.BorderFont = ig.Font.extend({

        borderSize: 1,

        onLoad: function(event) {
            // Calculate metrics for the font.
            this.parent(event);

            // Create new offscreen canvas where we will build out new font.
            var canvas = ig.$new('canvas');
            canvas.width = this._getNewFontWidth();
            canvas.height = this._getNewFontHeight();
            var ctx = canvas.getContext('2d');

            // Loop through every character in the font.
            for(var c=0; c<this.widthMap.length; c++) {
                var x = this.indices[c];
                var y = 0;
                var width = this.widthMap[c];
                var height = this.height - 2;
                var data = ctx.getImageData(x, y, width, height);
                var pixels = _getNonAlphaPixels(data);
                // Loop through non-alpha pixels.
                for (var px in pixels) {
                    for(var py in pixels[px]) {
                        // draw to canvas here.
                    }
                }
            }

        },

        // Returns the new width after accounting for borders.
        _getNewFontWidth: function() {
            var widthFromBorders = this.widthMap.length * (this.borderSize * 2);
            var widthFromFont = 0;
            for(var i=0; i<this.widthMap.length; i++) {
                widthFromFont += this.widthMap[i];
            }
            return widthFromBorders + widthFromFont;
        },

        // Returns the new height after accounting for borders.
        _getNewFontHeight: function() {
            return this.height + this.borderSize * 2;
        },

        _getNonAlphaPixels: function(data) {
            var nonAlphaPixels = {};
            for(var x = 0; x < data.width; x++) {
                for(var y = 0; y < data.height; y++) {
                    var alpha = data[((data.width * y) + x) * 4 + 3]; // alpha data for pixel
                    // Is the pixel non-alpha?
                    if(alpha !== 0) {
                        // Remember that this x and y is non alpha!
                        if(typeof nonAlphaPixels[x] === 'undefined') nonAlphaPixels[x] = { y: true };
                        else nonAlphaPixels[x][y] = true;
                    }
                }
            }
            return nonAlphaPixels;
        }

    });

});