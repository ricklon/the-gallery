theGallery
===========
Online automated art gallery based on your search input.

There is now a working prototype currently being hosted at owlsketch.github.io/the-gallery

Want an automatically created gallery of your favorite artist?

This program is based on two programs. A python web scraper, that gets the images of your favorite artist from http://www.metmuseum.org/collection/the-collection-online, and a webGL/ThreeJs application that dynamically makes your own art gallery.

![Alt text](https://github.com/satimidus/the-gallery/blob/master/img/screenshot.png "ARTSY PROGRAMMING")


#UPDATE
Now working on beta version that will rebuild the system but implements certain imperative functions. 

TODO:

Structure:

		---> gallery application.

			---> painting selection ---> displays information on painting
			
			---> search input for different artists ---> new gallery application


Scraping source: Currently using a python web scraper, needs to be called as a script. Other sources besides Metropolitan museum?
    Information is stored in .json files.

Controls: Simple controls are implemented. Need a toggle for anti-alias. Need a method for selecting paintings. Append search bar.

Main Menu: Add search bar for selecting painters. Credits at the bottom and thanks. Links to github/twitter/etc at bottom.
	While waiting, camera should pan around the scene in the background.

Paintings: Currently static objects that do not permit interaction. Instead need to permit interactivity by hovering
	or clicking in order to display NYTIMES articles. Need to have the correct proportions for all the paintings. 
	Currently, paintings have a uniform base width, presenting all paintings as having relatively the same size. 
	Need to create a ratio instead.

VR: append google script for use with virtual reality. 

