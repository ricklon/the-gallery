theGallery
===========
Online automated art gallery based on your search input.

Want an automatically created gallery of your favorite artist?

This program is based on two programs. A python web scraper, that gets the images of your favorite artist from http://www.metmuseum.org/collection/the-collection-online, and a webGL/ThreeJs application that dynamically makes your own art gallery.

![Alt text](https://github.com/satimidus/the-gallery/blob/master/img/screenshot.png "ARTSY PROGRAMMING")

Currently, searching for your favorite artist means opening downloader.py and putting your search query in the variable search_term. Instead of spaces, use the + symbol. 

I need sleep.

#UPDATE
There is now a working prototype currently being hosted at owlsketch.github.io/the-gallery

Now working on beta version that will rebuild the system from scratch but implements certain imperative functions. 

TODO:

Structure:

	loading screen(???)

		---> gallery application.

			---> search input for different artists ---> new gallery application

			---> painting selection ---> displays information on painting

Scraping source: Currently using a python web scraper, needs to be called as a script. Other sources besides Met?

Controls: Currently, controls are WASD and arrow keys. Need to switch to mouse for seeing-around and WASD for moving.

Setting: Currently only a floor with no texture. Have a bounding box that is representative of a real gallery. 

Paintings: Currently static objects that do not permit interaction. Instead need to permit interactivity by hovering
	or clicking in order to display NYTIMES articles. Need to have the correct proportions for all the paintings. 
	Currently, paintings have a uniform base width, presenting all paintings as having relatively the same size. 
	Need to create a ratio instead.

VR: append google script for use with virtual reality. 

