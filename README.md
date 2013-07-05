## Summary ##
This ImpactJS plugin allows you to add borders to fonts, and change the color of the font too.

![Demo Screenshot](http://i.imgur.com/OqRpm0O.png)

## Installation ##
1. Download the plugin [here](https://raw.github.com/Joncom/impact-font-borders/master/lib/plugins/joncom/font-borders.js).
2. Place plugin in the directory: `/lib/plugins/joncom/`.
3. Load `'plugins.joncom.font-borders'` within your game.

## Examples ##

### Add a black border to a font. ###
`var font = new ig.Font('media/font.png', { borderColor: '#000' });`

### Change the color of a font. ###
`var font = new ig.Font('media/font.png', { fontColor: '#F00' });`

### Set thickness of a border. ###
`var font = new ig.Font('media/font.png', { borderColor: '#000', borderSize: 2 });`

### Other options can also be set this way. ###
`var font = new ig.Font('media/font.png', { letterSpacing: 1 });`

### Set a different color for specific words. ###
![screenshot](http://i.imgur.com/sPGbbEU.png)

`font.draw("The [#000000 quick] brown fox", x, y);`

## TODO ##
- Allow preload option to specify colors intended for on-the-fly use.