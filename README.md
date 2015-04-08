# pubslides
an easy solution to control slides at presentations from distant locations.

## how to use

the users will open the *index.html* page and they will be listening for changes.
the client page has no control.
you need to open the *master.html* and control the slides using the keys right
and left from your keyboard or the controls on the screen.
you can change the name of the master page for security reasons.
the clock can be used if you want, but it is based on javascript threads that
can miss some seconds.

the pages are using PubNub cloud service to communicate, so there's no need
for any previous setup.
we recommend you to use your own keys, and you can do it easily on PubNub web site.
the free account permits 20 clients.
every page will count as one client when opened on a browser, and it also include all master and client pages.

## preparing the slides

the slides need to be converted to svg.
you can use scriptpdf2svg.sh to do it for you.
this script uses pdfseparate and pdf2svg from the terminal.
make sure you have these programs installed.
you can use the script in this way:

`$./scriptpdf2svg file.pdf`

the folder *slides* will be fully erased and recreated with the slides in svg format.
all slides are previously load in the beginning of the presentation, and nobody will have loading problems.
if you don't know how to do it, drop me a line.

## and..

questions, contributions, issues, and comments are welcome!

= )<br>
dj
