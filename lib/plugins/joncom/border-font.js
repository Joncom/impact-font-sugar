/*
 * Plugin for ImpactJS which adds borders to fonts.
 *
 * @author   Jonathan Commins
 * @email    joncom@gmail.com
 * @url      https://github.com/Joncom/impact-border-font/blob/master/lib/plugins/joncom/border-font.js
 * @created  April 14, 2013
 *
 */

ig.module('plugins.joncom.border-font')
.requires('impact.font')
.defines(function() {

    "use strict";

    ig.BorderFont = ig.Font.extend({

        fontColor: null,
        borderColor: '#000',
        borderSize: 1,
        fillCorners: true, // When false, creates a decent "slim" look, but only when borderSize is 1.
        letterSpacing: 0,

        staticInstantiate: function(path, settings) {
            // Load in settings, regardless of whether or not we are going to use this object or reference
            // an existing one, because these settings have an impact on the generation of the path.
            if(typeof settings === 'object') ig.merge(this, settings);
            // Check if the path already exists in cache.
            return this.parent(this._getNewPath(path));
        },

        init: function(path) {
            // Load path which was not found in the cache.
            this.parent(this._getNewPath(path));
        },

        onload: function(event) {

            // Calculate metrics for the font.
            this.parent(event);

            // We want this.data to be converted to a canvas if scale is 1.
            // This happens automatically when scale is not 1.
            if(ig.system.scale === 1) this.resize(ig.system.scale);

            // Create new offscreen canvas where we will build out new font.
            var canvas = ig.$new('canvas');
            canvas.width = this._getNewFontWidth();
            canvas.height = this._getNewFontHeight() + 2; // +2 because we will rebuild the bottom line.
            var newContext = canvas.getContext('2d');

            // Used to read the original font data.
            var oldContext = this.data.getContext('2d');
            var oldFontData = oldContext.getImageData(0, 0, this.data.width, this.data.height);

            // Use font color from original font, unless one has been specified instead.
            var fontRGB = (this.fontColor === null ? this._getNonAlphaRBG(oldFontData) : this._getRGBFromHex(this.fontColor));
            var borderRGB = this._getRGBFromHex(this.borderColor);

            // A place to put the new font pixels.
            var newFontData = newContext.getImageData(0, 0, canvas.width, canvas.height);

            // Loop through every character in the original font.
            for(var c=0; c<this.widthMap.length; c++) {
                var x = this.indices[c] * ig.system.scale;
                var y = 0;
                var width = this.widthMap[c] * ig.system.scale;
                var height = (this.height - 2) * ig.system.scale; // -2 because bottom lines contain no font.
                // Offset is used to make room for borders in the new font sheet.
                var offsetX = ((c+1) * this.borderSize * ig.system.scale) + (c * this.borderSize * ig.system.scale);
                var offsetY = this.borderSize * ig.system.scale;
                var charData = oldContext.getImageData(x, y, width, height);
                var pixels = this._getNonAlphaPixels(charData);
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
                                newFontData.data[((newFontData.width * (y+by+offsetY)) + x+bx+offsetX) * 4] = borderRGB.r; // red
                                newFontData.data[((newFontData.width * (y+by+offsetY)) + x+bx+offsetX) * 4 + 1] = borderRGB.g; // green
                                newFontData.data[((newFontData.width * (y+by+offsetY)) + x+bx+offsetX) * 4 + 2] = borderRGB.b; // blue
                                newFontData.data[((newFontData.width * (y+by+offsetY)) + x+bx+offsetX) * 4 + 3] = 255; // alpha
                            }
                        }
                        // Fill character body.
                        newFontData.data[((newFontData.width * (y+py+offsetY)) + x+px+offsetX) * 4] = fontRGB.r; // red
                        newFontData.data[((newFontData.width * (y+py+offsetY)) + x+px+offsetX) * 4 + 1] = fontRGB.g; // green
                        newFontData.data[((newFontData.width * (y+py+offsetY)) + x+px+offsetX) * 4 + 2] = fontRGB.b; // blue
                        newFontData.data[((newFontData.width * (y+py+offsetY)) + x+px+offsetX) * 4 + 3] = 255; // alpha
                    }
                }
                // Redraw the bottommost info-line.
                var first = x+offsetX-(this.borderSize*ig.system.scale);
                var last = x+offsetX+width+(this.borderSize*ig.system.scale);
                for(var i=first; i<last; i++) {
                    newFontData.data[((newFontData.width * (canvas.height - 1)) + i) * 4] = 255; // red
                    newFontData.data[((newFontData.width * (canvas.height - 1)) + i) * 4 + 1] = 0; // green
                    newFontData.data[((newFontData.width * (canvas.height - 1)) + i) * 4 + 2] = 0; // blue
                    newFontData.data[((newFontData.width * (canvas.height - 1)) + i) * 4 + 3] = 255; // alpha
                }
            }

            // Write new font data to offscreen canvas.
            newContext.putImageData(newFontData, 0, 0);

            // Replace original font data with the new font data.
            this.data = canvas;
            for(var i=0; i<this.indices.length; i++) this.indices[i] += (i * this.borderSize * 2); // Rebuild indices.
            for(var w=0; w<this.widthMap.length; w++) this.widthMap[w] += (this.borderSize * 2); // Rebuild widthMap.
            this.width += (this.widthMap.length * this.borderSize * 2);
            this.height += (this.borderSize * 2);
        },

        // Create unique path based on border and font color, and border size.
        _getNewPath: function(path) {
            return path + this._makeHexSafe(this.borderColor) + ( this.fontColor ? this._makeHexSafe(this.fontColor) : '' ) + '#' + this.borderSize;
        },

        // Converts shorthand hexes into standard form and ensures a # prefix.
        _makeHexSafe: function(hex) {
            if(hex.charAt(0) === '#') hex = hex.substring(1); // Strip # prefix.
            if(hex.length === 3) hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
            hex = '#' + hex; // Add # prefix.
            return hex;
        },

        _getRGBFromHex: function(hex) {
            // Concern hex to standard form.
            hex = this._makeHexSafe(hex);
            // Trim '#'.
            if (hex.charAt(0) === '#') hex = hex.substring(1);
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
        },

        _getNonAlphaRBG: function(image) {
            var nonAlphaPixels = {};
            for(var x = 0; x < image.width; x++) {
                for(var y = 0; y < image.height; y++) {
                    var red = image.data[((image.width * y) + x) * 4];
                    var green = image.data[((image.width * y) + x) * 4 + 1];
                    var blue = image.data[((image.width * y) + x) * 4 + 2];
                    var alpha = image.data[((image.width * y) + x) * 4 + 3];
                    // Is the pixel non-alpha?
                    if(alpha !== 0) return { r: red, g: green, b: blue };
                }
            }
            throw "Image data contained only alpha!";
        }

    });

});