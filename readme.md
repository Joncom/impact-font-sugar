## Summary ##
This plugin for ImpactJS extends ig.Font to allow for colored borders.
Futhermore it allows you to alter the color of the font itself.

## Demo ##
http://www.commins.ca/impact-border-font/

## Installation ##
Download the plugin here: 
https://github.com/Joncom/impact-border-font/blob/master/lib/plugins/joncom/border-font.js

Place the plugin in the directory: 
`/lib/plugins/joncom/'

Load the plugin within any module you'd like. Example:
`.requires('plugins.joncom.border-font')`

## Usage ##
Check out `main.js` to see the demo code in action.

You load a border font like you would a regular font.
However, you call `ig.BorderFont` instead:
`var font = new ig.BorderFont('media/04b03.font.png');`

By default, this adds a black border and leaves the font color unchanged.

#### Options ####

Additional settings can be passed in using the following syntax.
`var font = new ig.BorderFont(path, options);`
where `options` is an object.

###### fontColor ######
Changes the color of the font:
`var font = new ig.BorderFont('media/04b03.font.png', { fontColor: '#FFFFFF' });`

###### borderColor ######
Sets the color of the border.
To red, for example:
`var font = new ig.BorderFont('media/04b03.font.png', { borderColor: '#FF000' });`

###### borderSize ######
Sets the thickness of the border in pixels.
Default is 1. 
Example: `var font = new ig.BorderFont('media/04b03.font.png', { borderSize: 2 });`

###### letterSpacing ######
The pixel space between letters.
Default is 0.
Example: `var font = new ig.BorderFont('media/04b03.font.png', { letterSpacing: 1 });

###### Multiple Options ######
If you want to set several options together, it can be done like so:
`var options = { letterSpacing: 1, borderSize: 2, fontColor: '#FFF', borderColor: '#000' };
`var font = new ig.BorderFont('media/04b03.font.png', options);`




