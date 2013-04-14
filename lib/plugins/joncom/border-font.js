ig.module('plugins.joncom.border-font')
.requires('impact.font')
.defines(function() {

    "use strict";

    ig.BorderFont = ig.Font.extend({

        borderSize: 1,

        onload: function(event) {

            // Calculate metrics for the font.
            this.parent(event);

            // Create new offscreen canvas where we will build out new font.
            var canvas = ig.$new('canvas');
            canvas.width = this._getNewFontWidth() * ig.system.scale;
            canvas.height = this._getNewFontHeight() * ig.system.scale;
            var ctx = canvas.getContext('2d');
            var oldCtx = this.data.getContext('2d');

            // A place to put the border pixels.
            var borderData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            // Loop through every character in the font.
            for(var c=0; c<this.widthMap.length; c++) {
                var x = this.indices[c] * ig.system.scale;
                var y = 0;
                var width = this.widthMap[c] * ig.system.scale;
                var height = (this.height - 2) * ig.system.scale; // -2 because bottom lines contain no font.
                var image = oldCtx.getImageData(x, y, width, height);
                var pixels = this._getNonAlphaPixels(image);
                // Loop through non-alpha pixels.
                for (var px in pixels) {
                    px = parseInt(px);
                    for(var py in pixels[px]) {
                        py = parseInt(py);
                        //for(var up = 0; up < this.borderSize; up++) {
                            borderData.data[((borderData.width * (py+y)) + px+x) * 4] = 255; // red
                            borderData.data[((borderData.width * (py+y)) + px+x) * 4 + 1] = 255; // green
                            borderData.data[((borderData.width * (py+y)) + px+x) * 4 + 2] = 255; // green
                            borderData.data[((borderData.width * (py+y)) + px+x) * 4 + 3] = 255; // alpha
                        //}
                    }
                }
            }

            this.testImage = borderData; // Show rebuilt font.
            //this.testImage = oldCtx.getImageData(0, 0, this.data.width, this.data.height); // Show original font.

            this.testCanvas = canvas;
        },

        draw: function(text, x, y, align) {
            this.parent(text, x, y, align);
            ig.system.context.putImageData(this.testImage, 10, 10);
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

        _getNonAlphaPixels: function(image) {
            var nonAlphaPixels = {};
            for(var x = 0; x < image.width; x++) {
                for(var y = 0; y < image.height; y++) {
                    var alpha = image.data[((image.width * y) + x) * 4 + 3]; // alpha data for pixel
                    // Is the pixel non-alpha?
                    if(alpha !== 0) {
                        // Remember that this x and y is non alpha!
                        if(typeof nonAlphaPixels[x] === 'undefined') nonAlphaPixels[x] = {};
                        nonAlphaPixels[x][y] = true;
                    }
                }
            }
            return nonAlphaPixels;
        }

    });

});