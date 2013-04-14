ig.module('plugins.joncom.border-font')
.requires('impact.font')
.defines(function() {

    "use strict";

    ig.BorderFont = ig.Font.extend({

        borderSize: 1,

        onLoad: function(event) {
            this._addBorderToFont();
            this.parent(event);
        },

        _addBorderToFont: function() {
            // First create an offscreen canvas.
            var canvas = ig.$new('canvas');
            // Add extra space for border.
            canvas.width = this.data.width + (this.borderSize * 2);
            canvas.height = this.data.height + (this.borderSize * 2);
        }

    });

});