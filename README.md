theGallery
===========
Online automated art gallery based on your search input.

Want an automatically created gallery of your favorite artist?

This program is based on two programs. A python web scraper, that gets the images of your favorite artist from http://www.metmuseum.org/collection/the-collection-online, and a webGL/ThreeJs application that dynamically makes your own art gallery.

#HOW TO:
In the console at the main directory:

    cd python
    python downloader.py 
    cd ..
    node server.js

Then go to your browser and your gallery is on your localhost:8888.

Currently, searching for your favorite artist means opening downloader.py and putting your search query in the variable search_term. Instead of spaces, use the + symbol. 

I need sleep.
