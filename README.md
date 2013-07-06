## Summary ##
This ImpactJS plugin allows you to customize your fonts. Add borders. Change the color. It can even change specific words or characters on-the-fly.

![border-screenshot](http://i.imgur.com/JLzjPfe.png)

![color-screenshot](http://i.imgur.com/h408CrP.png)

## Installation ##
1. Put plugin here: `/lib/plugins/joncom/font-sugar/`
2. Require `'plugins.joncom.font-sugar.font'`.

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