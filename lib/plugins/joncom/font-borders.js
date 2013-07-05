/*
 * Plugin for ImpactJS which adds borders to fonts.
 *
 * @author   Jonathan Commins
 * @email    joncom@gmail.com
 * @url      https://github.com/Joncom/impact-font-border/blob/master/lib/plugins/joncom/border-font.js
 * @created  April 14, 2013
 *
 */

ig.module(
    'plugins.joncom.font-borders'
)
.requires(
    'impact.font',
    'plugins.joncom.canvas-image'
)
.defines(function() {

    "use strict";

    ig.Font.inject({

        fontColor: null,
        borderColor: null,
        borderSize: 1,
        fillCorners: true, // When false, creates a decent "slim" look, but only when borderSize is 1.

        fontCanvas: null,
        borderCanvas: null,
        lineCanvas: null,

        revertCanvas: null,
        alternateFont: null,

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

            // Remove illegal sized character if present, which
            // is caused by image having an extra space at the end.
            if(this.widthMap[this.widthMap.length-1] === 0) {
                this.widthMap.pop();
                this.indices.pop();
            }

            if(this.fontColor || this.borderColor) {
                // "this.data" must be a canvas so we can work with it.
                this._ensureDataIsCanvas();
            }

            if(this.fontColor) {
                var canvas = this.data;
                var color = this._getRGBFromHex(this.fontColor);
                this._convertNonAlphaPixelsInCanvasToColor(canvas, color);
            }

            if(this.borderColor && this.borderSize >= 1) {

                this._addSpaceForBorders();
                this.fontCanvas = this.data;
                this.borderCanvas = this._createBorderCanvas(this.fontCanvas);
                this.lineCanvas = this._createLineCanvas();

                var canvas = ig.$new('canvas');
                canvas.width = this.fontCanvas.width;
                canvas.height = this.fontCanvas.height;
                var context = canvas.getContext('2d');

                // Merge font, border and line into a single canvas.
                context.drawImage(this.fontCanvas, 0, 0);
                context.drawImage(this.borderCanvas, 0, 0);
                context.drawImage(this.lineCanvas, 0, 0);

                this.data = canvas;
            }

            // Cache canvases.
            if(this.borderCanvas) {
                var path = this.getBasePath();
                var image = new ig.CanvasImage(path, this.borderCanvas);
                console.log(image);
            }

            this.revertCanvas = this.data;
        },

        draw: function( text, x, y, align ) {
            if( typeof(text) != 'string' ) {
                text = text.toString();
            }

            // Multiline?
            if( text.indexOf('\n') !== -1 ) {
                var lines = text.split( '\n' );
                var lineHeight = this.height + this.lineSpacing;
                for( var i = 0; i < lines.length; i++ ) {
                    this.draw( lines[i], x, y + i * lineHeight, align );
                }
                return;
            }

            if( align == ig.Font.ALIGN.RIGHT || align == ig.Font.ALIGN.CENTER ) {
                var width = this._widthForLine( text );
                x -= align == ig.Font.ALIGN.CENTER ? width/2 : width;
            }

            if( this.alpha !== 1 ) {
                ig.system.context.globalAlpha = this.alpha;
            }

            var skipCount = 0;

            for( var i = 0; i < text.length; i++ ) {
                var c = text.charCodeAt(i);

                if(c === 91) { // Check for "["
                    var color = this.getColorAtStartOfString(text.substr(i+1));
                    if(color) {
                        var skip = ('[' + color + ' ').length;
                        this.setFontColor(color);
                        skipCount += skip;
                        i += skip - 1;
                        continue;
                    }
                }

                if(c === 93) { // Check for "]"
                    this.revertFontColor();
                    skipCount += (']').length;
                    continue;
                }

                x += this._drawChar( c - this.firstChar, x, y );
            }

            if( this.alpha !== 1 ) {
                ig.system.context.globalAlpha = 1;
            }
            ig.Image.drawCount += text.length - skipCount;
        },

        getBasePath: function() {
            var stop = this.path.indexOf('?');
            var path = (stop === -1 ? this.path : this.path.substr(0, stop));
            return path;
        },

        setFontColor: function(color) {
            var path = this.getBasePath();
            var settings = { fontColor: color };
            if(this.borderSize) settings.borderSize = this.borderSize;
            if(this.borderColor) settings.borderColor = this.borderColor;
            this.alternateFont = new ig.Font(path, settings);
            this.data = this.alternateFont.data;
        },

        revertFontColor: function() {
            this.data = this.revertCanvas;
        },

        getColorAtStartOfString: function(string) {
            var regExp = /#[a-fA-F0-9]{3,6}/;
            var match = string.match(regExp);
            // Does color exist at very start?
            if(match && match.index === 0) {
                var color = match[0];
                return color;
            } else {
                return null;
            }
        },

        _widthForLine: function(text) {
            var width = 0;
            for (var i = 0; i < text.length; i++) {
                var c = text.charCodeAt(i);
                if(c === 91) { // Check for "["
                    var subText = text.substr(i+1);
                    var color = this.getColorAtStartOfString(subText);
                    if(color) {
                        var skip = ('[' + color + ' ').length;
                        i += skip - 1;
                        continue;
                    }
                }
                if(c === 93) { // Check for "]"
                    continue;
                }
                width += this.widthMap[c - this.firstChar] + this.letterSpacing;
            }
            return width;
        },

        _addSpaceForBorders: function() {
            var canvas = ig.$new('canvas');
            canvas.width = this._getNewFontWidth();
            canvas.height = this._getNewFontHeight();

            var newContext = canvas.getContext('2d');
            var oldContext = this.data.getContext('2d');

            // Loop through every character in the original font.
            for (var c = 0; c < this.widthMap.length; c++) {
                var x = this.indices[c] * ig.system.scale;
                var y = 0;
                var width = this.widthMap[c] * ig.system.scale;
                var height = (this.height - 2) * ig.system.scale; // -2 because bottom lines contain no font.
                var offsetX = ((c + 1) * this.borderSize * ig.system.scale) + (c * this.borderSize * ig.system.scale);
                var offsetY = this.borderSize * ig.system.scale;
                var charData = oldContext.getImageData(x, y, width, height);
                newContext.putImageData(charData, x + offsetX, y + offsetY);
            }

            // Rebuild indices.
            for(var i=0; i<this.indices.length; i++) {
                this.indices[i] += (i * this.borderSize * 2);
            }

            // Rebuild widthMap.
            for(var w=0; w<this.widthMap.length; w++) {
                this.widthMap[w] += (this.borderSize * 2);
            }

            this.width += (this.widthMap.length * this.borderSize * 2);
            this.height += (this.borderSize * 2);
            this.data = canvas;
        },

        _createLineCanvas: function() {
            var canvas = ig.$new('canvas');
            canvas.width = this.data.width;
            canvas.height = this.data.height
            var context = canvas.getContext('2d');
            var newData = context.getImageData(0, 0, canvas.width, canvas.height);

            // Loop through every character in the font.
            for (var c = 0; c < this.widthMap.length; c++) {
                var x = this.indices[c] * ig.system.scale;
                var y = 0;
                var width = this.widthMap[c] * ig.system.scale;
                var offsetX = ((c + 1) * this.borderSize * ig.system.scale) + (c * this.borderSize * ig.system.scale);
                var first = x + offsetX - (this.borderSize * ig.system.scale);
                var last = x + offsetX + width + (this.borderSize * ig.system.scale);
                for (var i = first; i < last; i++) {
                    newData.data[((newData.width * (newData.height - 1)) + i) * 4] = 255; // red
                    newData.data[((newData.width * (newData.height - 1)) + i) * 4 + 1] = 0; // green
                    newData.data[((newData.width * (newData.height - 1)) + i) * 4 + 2] = 0; // blue
                    newData.data[((newData.width * (newData.height - 1)) + i) * 4 + 3] = 255; // alpha
                }
            }

            context.putImageData(newData, 0, 0);
            return canvas;
        },

        _createBorderCanvas: function(data) {
            if(!this.fontCanvas) {
                throw "Define font canvas before border canvas!";
            }

            var canvas = ig.$new('canvas');
            canvas.width = data.width;
            canvas.height = data.height;

            var newContext = canvas.getContext('2d');
            var oldContext = data.getContext('2d');

            var newData = newContext.getImageData(0, 0, canvas.width, canvas.height);
            var oldData = oldContext.getImageData(0, 0, this.data.width, this.data.height);

            var color = this._getRGBFromHex(this.borderColor);
            var fontPixels = this._getNonAlphaPixels(oldData);

            for (var px in fontPixels) {
                px = parseInt(px);
                for (var py in fontPixels[px]) {
                    py = parseInt(py);

                    var borderPixels = this._getBorderPixels(px, py);

                    for (var bx in borderPixels) {
                        bx = parseInt(bx);
                        for (var by in borderPixels[bx]) {
                            by = parseInt(by);

                            if (typeof fontPixels[bx] !== 'undefined' && typeof fontPixels[bx][by] !== 'undefined') {
                                continue; // Do not draw borders inside of font.
                            }

                            newData.data[((newData.width * by) + bx) * 4] = color.r; // red
                            newData.data[((newData.width * by) + bx) * 4 + 1] = color.g; // green
                            newData.data[((newData.width * by) + bx) * 4 + 2] = color.b; // blue
                            newData.data[((newData.width * by) + bx) * 4 + 3] = 255; // alpha
                        }
                    }
                }
            }

            newContext.putImageData(newData, 0, 0);
            return canvas;
        },

        _ensureDataIsCanvas: function() {
            if(ig.system.scale === 1) {
                this.resize(ig.system.scale);
            }
        },

        _convertNonAlphaPixelsInCanvasToColor: function(canvas, color) {
            var context = canvas.getContext('2d');
            var fontData = context.getImageData(0, 0, canvas.width, canvas.height);
            var pixels = this._getNonAlphaPixels(fontData);
            for (var x in pixels) {
                x = parseInt(x);
                for (var y in pixels[x]) {
                    y = parseInt(y);
                    fontData.data[((fontData.width * y) + x) * 4] = color.r; // red
                    fontData.data[((fontData.width * y) + x) * 4 + 1] = color.g; // green
                    fontData.data[((fontData.width * y) + x) * 4 + 2] = color.b; // blue
                }
            }
            context.putImageData(fontData, 0, 0);
        },

        // Create unique path based on border and font color, and border size.
        _getNewPath: function(path) {
            var newPath = path;
            if(this.fontColor) {
                newPath += '?color=' + this._makeHexSafe(this.fontColor);
            }
            if(this.borderColor && this.borderSize >= 1) {
                newPath += (!this.fontColor ? '?' : '&');
                newPath += 'border=' + this._makeHexSafe(this.borderColor) +
                           '&size=' + this.borderSize;
            }
            return newPath;
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
            return (this.height + this.borderSize * 2) * ig.system.scale;
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