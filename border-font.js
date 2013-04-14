ig.module('plugins.joncom.border-font')
.requires('impact.font')
.defines(function() {

    "use strict";

    ig.BorderFont = ig.Font.extend({

        borderSize: 1,

        onLoad: function(event) {
            var nonAlphaPixels = _getNonAlphaPixels(this.data);



            this.parent(event);
        },

        _getNonAlphaPixels: function(image) {
            // Create an offscreen canvas.
            var canvas = ig.$new('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            // Draw image to canvas.
            var ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
            // Determine which pixels are alpha and which are not.
            var data = ctx.getImageData(0, 0, image.width, image.height);
            var nonAlphaPixels = {};
            for(var x = 0; x < canvas.width; x++) {
                for(var y = 0; y < canvas.height; y++) {
                    var alpha = data[((image.width * y) + x) * 4 + 3]; // alpha data for pixel
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