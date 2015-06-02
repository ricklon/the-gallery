#This is a simple web scraper that goes to the met museum and writes down the necessary data into a json file
# and downloads the main image for the three.js application.
#The process is as follows:
#   The first argument is the search term. What artist you wish to look up.
#       Because the previous can be a search term not restricted to just artists, no filtering on the results
#       will be done.
#   Because we want a default output of 30 paintings, we will scrape through the sites until we either hit our
#       requirement or run out of pages.
#   Finally, we will download the main image, and append all the necessary information to a json file.
#       The titles of the files are simple the index. 1st article is index 0, 2nd is index 1 and so on.

import requests
import bs4 #parsing through html
import json #need to write a json file

#setting up the urls that will be used
main_url = 'http://www.metmuseum.org'
root_url = 'http://www.metmuseum.org/collection/the-collection-online'
search_term = 'Vincent+Van+Gogh' #put search term here. Replace spaces with +: Vincent+Van+Gogh. Not case sensitive
image_toggle = '&amp;ao=on&amp;noqs=true' #show only artwork with images. Default is true
collections_url = root_url + '/search?ft=' + search_term + image_toggle + '&rpp=30&pg='
image_count = 0
paintings_requested = 30

#returns a list of urls for every individual painting
def get_img_urls():
    index = 1
    links = []
    global image_count
    while image_count < paintings_requested:
        #Get the html doc for given page number
        response = requests.get(collections_url+str(index))
        #get text to edit
        soup = bs4.BeautifulSoup(response.text)
        #get all the links
        for a in soup.select("div.list-view-object-info a"):
            if a.parent['class'][0] == 'gallery':
                continue #skip if a is not an actual painting
            links.append(a.attrs.get('href'))
            image_count = image_count + 1 #number of painting links scraped so far
        #index = index + 1 #if 30 paintings collected, while loop will terminate this process. If not, repeat with
        #the next page available. NOTE NEED A BREAK CASE FOR WHEN # OF PAGES RUNS OUT AND STILL UNDER 30
    return links
    #above needs var main_url in front of links in order for them to work


def get_data(art_pages):
	for links in art_pages:
		print(main_url+links)
	    #for every individual page. Get info. Image.	
		response = requests.get(main_url+links)
		soup = bs4.BeautifulSoup(response.text)
		print(soup.select('div.image-controls-container')[0])
		print(soup.find('h2'))
		print(soup.select('div.tombstone-container h3'))
		print(soup.select('div.tombstone')[0])
		print(soup.select('div.gallery')[0])
		print('=============================================')

page_urls = get_img_urls() #get a list of x number of paintings requested urls
get_data(page_urls) #gets info for every link in list
