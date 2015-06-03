#TODO:
#   Provide arguments for search and optional quatity to request(Default is 30)
#   Account for fail cases, such as when a link we request doesn't exist


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
index = 1
links = []
entries_availables = None
quantity_requested = 30 
#need to get number of available entries
#then need to filter out unnaproved images
#


def quantity_of_images(count):
    global links
    global image_count
    global entries_available
    #Get the html doc for given page number
    response = requests.get(collections_url+str(count))
    #get text to edit
    soup = bs4.BeautifulSoup(response.text)

    #in current page, loop through all links
    for a in soup.select("div.list-view-object-info a"):
        if a.parent['class'][0] == 'gallery':
            continue #skip if a is not an actual painting
        if image_count < quantity_requested:
            #right now, as long as it is a painting with an image
            #it gets pushed to our array. Must filter so only OASC
            #approved images are pushed
            links.append(a.attrs.get('href'))
            image_count = image_count + 1
        entries_available = entries_available - 1
    return True
    
#returns a list of urls for every individual painting, with determinant for how
#many paintings to get. Default is 30.
def get_img_urls():
    global image_count
    global index
    global entries_available
    #first get the main directory page of your search
    response = requests.get(collections_url+str(1))
    soup = bs4.BeautifulSoup(response.text)
    #from the directory page we determine how many available paintings 
    #there are to possibly scrape. Still unknown if OASC approved or not
    entries_available = soup.find_all("div", class_="resultcount-text")
    entries_available = int(entries_available[0].b.get_text())
    #now we know amount of available paintings

    #we now scrape until we get 30 entry links or run out of entries
    while(image_count < quantity_requested and entries_available > 0):
        quantity_of_images(index)
        index = index + 1
    return links
    #above needs var main_url in front of links in order for them to work

#Scrapes the individual art painting pages
def get_data(art_pages):
	for links in art_pages:
		print(main_url+links)
	    #for every individual page. Get info. Image.	
		response = requests.get(main_url+links)
		soup = bs4.BeautifulSoup(response.text)
		#print(soup.select('div.image-controls-container')[0])
		print(soup.find_all("a", class_="oasc")[0].text)
		print(soup.find_all("a", class_="permalink")[0].text)
		print(main_url + soup.find_all("a", class_="permalink")[0].attrs.get('href'))
		print(soup.find_all("a", class_="download")[0].text)
		print(soup.find_all("a", class_="download")[0].attrs.get('href'))

		imagine = soup.select('div.image-controls-container img')
		print('Image src')
		print(imagine[0]['src'])

		print(soup.find('h2').text)
		print(soup.select('div.tombstone')[0].text)
		print(soup.select('div.gallery')[0].text)
		print(main_url + soup.select('div.gallery')[0].contents[1].attrs.get('href'))
		print('=============================================')

page_urls = get_img_urls() #get a list of x number of paintings requested urls
get_data(page_urls) #gets info for every link in list
