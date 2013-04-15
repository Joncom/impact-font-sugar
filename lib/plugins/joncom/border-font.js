ig.module('plugins.joncom.border-font')
.requires('impact.font')
.defines(function() {

    "use strict";

    ig.BorderFont = ig.Font.extend({

        fontColor: '#000000',
        borderColor: '#FFFFFF',
        borderSize: 1,
        fillCorners: false,

        onload: function(event) {

            // Calculate metrics for the font.
            this.parent(event);

            // Create new offscreen canvas where we will build out new font.
            var canvas = ig.$new('canvas');
            canvas.width = this._getNewFontWidth();
            canvas.height = this._getNewFontHeight();
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
                var offsetX = ((c+1) * this.borderSize * ig.system.scale) + (c * this.borderSize * ig.system.scale);
                var offsetY = this.borderSize * ig.system.scale;
                var image = oldCtx.getImageData(x, y, width, height);
                var pixels = this._getNonAlphaPixels(image);
                // Loop through non-alpha pixels.
                for (var px in pixels) {
                    px = parseInt(px);
                    for(var py in pixels[px]) {
                        py = parseInt(py);
                        // Find out which pixels should become border pixels.
                        var borderPixels = this._getBorderPixels(px, py);
                        // Loop through border pixels.
                        for (var bx in borderPixels) {
                            bx = parseInt(bx);
                            for(var by in borderPixels[bx]) {
                                by = parseInt(by);
                                if(typeof pixels[bx] !== 'undefined' && typeof pixels[bx][by] !== 'undefined') continue; // Don't draw border inside character.
                                borderData.data[((borderData.width * (y+by+offsetY)) + x+bx+offsetX) * 4] = 255; // red
                                borderData.data[((borderData.width * (y+by+offsetY)) + x+bx+offsetX) * 4 + 1] = 255; // green
                                borderData.data[((borderData.width * (y+by+offsetY)) + x+bx+offsetX) * 4 + 2] = 255; // green
                                borderData.data[((borderData.width * (y+by+offsetY)) + x+bx+offsetX) * 4 + 3] = 255; // alpha
                            }
                        }
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

        _getRGBFromHex: function(hex) {
            // Trim '#' if present.
            if (hex.charAt(0) === '#') hex = hex.substring(1);
            // Convert short form to long form.
            if (hex.length === 3) hex = charAt(0) + charAt(0) + charAt(1) + charAt(1) + charAt(2) + charAt(2);
            // Get RGB values.
            var r = parseInt(hex.substring(0, 2), 16);
            var g = parseInt(hex.substring(2, 4), 16);
            var b = parseInt(hex.substring(4, 6), 16);
            return { r: r, g: g, b: b };
        },

        // Returns an object containing the pixels which border the given pixel.
        _getBorderPixels: function(x, y) {
            var pixels = {};

            // Left
            for(var left = 1; left <= this.borderSize * ig.system.scale; left++) {
                if(typeof pixels[x-left] === 'undefined') pixels[x-left] = {};
                pixels[x-left][y] = true;
            }

            // Right
            for(var right = 1; right <= this.borderSize * ig.system.scale; right++) {
                if(typeof pixels[x+right] === 'undefined') pixels[x+right] = {};
                pixels[x+right][y] = true;
            }

            // Vertical
            if(typeof pixels[x] === 'undefined') pixels[x] = {};
            for(var up = 1; up <= this.borderSize * ig.system.scale; up++) pixels[x][y-up] = true; // Up
            for(var down = 1; down <= this.borderSize * ig.system.scale; down++) pixels[x][y+down] = true; // Down

            // Corners
            if(this.fillCorners) {
                // Top Left
                for(up = 1; up <= this.borderSize * ig.system.scale; up++)
                    for(left = 1; left <= this.borderSize * ig.system.scale; left++)
                        pixels[x-left][y-up] = true;
                // Bottom Left
                for(down = 1; down <= this.borderSize * ig.system.scale; down++)
                    for(left = 1; left <= this.borderSize * ig.system.scale; left++)
                        pixels[x-left][y+down] = true;
                // Top Right
                for(up = 1; up <= this.borderSize * ig.system.scale; up++)
                    for(right = 1; right <= this.borderSize * ig.system.scale; right++)
                        pixels[x+right][y-up] = true;
                // Bottom Right
                for(down = 1; down <= this.borderSize * ig.system.scale; down++)
                    for(right = 1; right <= this.borderSize * ig.system.scale; right++)
                        pixels[x+right][y+down] = true;
            }


            return pixels;
        },

        // Returns the new width after accounting for borders.
        _getNewFontWidth: function() {
            var widthFromBorders = this.widthMap.length * (this.borderSize * 2);
            var widthFromSpacing = (this.widthMap.length - 1);
            var widthFromFont = 0;
            for(var i=0; i<this.widthMap.length; i++) widthFromFont += this.widthMap[i];
            return (widthFromBorders + widthFromFont + widthFromSpacing) * ig.system.scale;
        },

        // Returns the new height after accounting for borders.
        _getNewFontHeight: function() {
            return ((this.height - 2) + this.borderSize * 2) * ig.system.scale; // -2 because bottom lines contain no font.
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