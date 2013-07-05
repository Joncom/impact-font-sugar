ig.module('plugins.joncom.canvas-image')
.requires('impact.image')
.defines(function() {

    "use strict";

    ig.CanvasImage = ig.Image.extend({

        init: function(path, canvas) {
            this.loaded = true;
            this.path = path;
            this.data = canvas;
            this.width = this.data.width / ig.system.scale;
            this.height = this.data.height / ig.system.scale;
            ig.Image.cache[this.path] = this;
        }

    });

});