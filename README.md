Gallery
===========
Online automated art gallery based on your search input.

There is now a functional alpha version currently being hosted at owlsketch.github.io/the-gallery

This program is based on two programs. A python web scraper, that gets the images of your favorite artist from http://www.metmuseum.org/collection/the-collection-online, and a webGL/ThreeJs application that dynamically makes your own art gallery.

![Alt text](https://cloud.githubusercontent.com/assets/5739127/11604668/98074df6-9abd-11e5-8efd-8badf16d294d.png "Gallery Image")


#Current Release
##v0.1-alpha.1

In this first release the following has been implemented:

1. Python Web Scraper for the Metropolitan Open Collection
	* Instantiate json files for every painting
2. Three.js/WebGL Gallery environment

3. Artwork has been loaded into the environment

4. Controls (W,A,S,D, and Spacebar), Pointer Lock (Camera pitch and yaw), and Fullscreen (F key) actions

#Next Release
##v0.1-alpha.2

The implementations (in order of priority) for the next release will be:

1. Menu for pause screen and rendering pause

2. Ray Cast selection of individual paintings

3. Player object collision against walls and other objects

4. Imported 3D objects successfully loaded

# Structure 
App structure is as follows:

		---> gallery application menu
			---> enter scene --> painting selection ---> displays information on painting
			---> search input for different artists ---> new gallery application


