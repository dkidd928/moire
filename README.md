# moiré
A simple moiré tester/visualizer related to halftone printing using the HTML5 Canvas API

index.html offers a simple moiré visualizer using the HTML5 Canvas API which allows one
to adjust the dot size, dot spread, and screen printing angles of CMYK halftone printing screens.

Currently there is only one angle to choose from, and each subsequent "screen" will be drawn
that many degrees from the last "screen." (Independent screen angles is a feature I plan to implement soon).

Currently the only color palette is CMYK (drawn in yellow, cyan, magenta, black order - another planned feature).

There is a blend feature available to allow a visualization of what printed colors
would look like (multiply and darken show this effect).

Warning: Blending can take a substantial amount of time and crash your browser depending on how large
         the columns/rows are. A 10x10 pattern of dots should yield very good results for blending with
         minimal wait time. Blending is capable at all sizes, but changing any variables will require
         all of the blending calculations to occur again - which is unfortunately slow.
