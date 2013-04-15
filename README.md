## Summary ##
This plugin for ImpactJS extends `ig.Font` to allow for colored borders. Furthermore it allows you to alter the color of the font itself.

![Demo Screenshot](http://i.imgur.com/OqRpm0O.png)

## Installation ##
1. Download the plugin [here](https://raw.github.com/Joncom/impact-border-font/master/lib/plugins/joncom/border-font.js).
2. Place plugin in the directory: `/lib/plugins/joncom/`.
3. Load `'plugins.joncom.border-font'` within your game.

## Usage ##

#### Creating a border-font is like creating a regular font. ####
`var font = new ig.BorderFont('media/04b03.font.png');`

By default, this adds a black border and leaves the font color unchanged.

#### Options are set by passing an object when you create the font. ####
`var font = new ig.BorderFont('media/04b03.font.png', /* options go here */);`
###### fontColor changes the color of the font. ######
`var font = new ig.BorderFont('media/04b03.font.png', { fontColor: '#FFFFFF' });`

###### borderColor changes the color of the border. ######
`var font = new ig.BorderFont('media/04b03.font.png', { borderColor: '#FF000' });`

###### borderSize changes the thickness of the border (default is 1). ######
Example: `var font = new ig.BorderFont('media/04b03.font.png', { borderSize: 2 });`

###### letterSpacing changes the spacing between letters (default is 0). ######
Example: `var font = new ig.BorderFont('media/04b03.font.png', { letterSpacing: 1 });
