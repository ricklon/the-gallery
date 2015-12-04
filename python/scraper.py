#TODO:
#   Provide arguments for search and optional quantity to request(Default is 30)
#   account for when OASC dissaproval means less than 30 final paintings


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

import sys
import requests
import bs4 #parsing through html
import urllib
import json #need to write a json file


#setting up the urls that will be used
main_url = 'http://www.metmuseum.org'
root_url = 'http://www.metmuseum.org/collection/the-collection-online'
if len(sys.argv) <= 1:
    print("Not enough arguments provided.")
    sys.exit()
search_term = sys.argv[1] #put search term here. Replace spaces with +: Vincent+Van+Gogh. Not case sensitive
image_toggle = '&amp;ao=on&amp;noqs=true' #show only artwork with images. Default is true
collections_url = root_url + '/search?ft=' + search_term + image_toggle + '&rpp=60&pg='


image_count = 0
index = 1
links = []
entries_availables = None
if len(sys.argv) == 3:
    quantity_requested = int(sys.argv[2])
else:
    quantity_requested = 30
#need to get number of available entries
#then need to filter out unnaproved images

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
    count = 0
    for links in art_pages:
        link = main_url+links
        #for every individual page. Get info. Image.    
        response = requests.get(link)
        soup = bs4.BeautifulSoup(response.text)
        #print(soup.select('div.image-controls-container')[0])
        oasc_approval = soup.find_all("a", class_="oasc")
        if not oasc_approval:
            continue
        oasc_approved = soup.find_all("a", class_="oasc")[0].text
       
        #Retrieves image link to store
        imagine = soup.select('div.image-controls-container img')[0]['src']
        permalink = soup.find_all("a", class_="permalink")
        if permalink:
            link_permalink = main_url + soup.find_all("a", class_="permalink")[0].attrs.get('href')

        downloadable = soup.find_all("a", class_="download")
        if downloadable:
            download_link = downloadable[0].attrs.get('href')

        title = soup.find('h2').text

        encode = {"Link": link, "Permalink": link_permalink, "Download": download_link, "Image": imagine, "Title": title}
        tombstone = soup.select('div.tombstone div')
        for info in tombstone:
            info = unicode(info.text)
            name = info[0:info.index(':')]
            remaining_info = info[info.rfind(':')+1:]
            remaining_info = remaining_info.strip()
            encode[name] = remaining_info

        gallery = soup.select('div.gallery')
        if gallery:
            gallery_loc = soup.select('div.gallery')[0].text.strip()
            encode['Location'] = gallery_loc
            if len(soup.select('div.gallery')[0].contents) > 1:
                gallery_link = main_url + soup.select('div.gallery')[0].contents[1].attrs.get('href')
                encode['Location Link'] = gallery_link
        jsonfile = open("../img/Artworks/" + str(count)+".json", 'w')
        jsonfile.write(json.dumps(encode, sort_keys=True, indent=4))
        jsonfile.close()
        urllib.urlretrieve(imagine,"../img/Artworks/"+ str(count)+".jpg")
        count = count + 1

page_urls = get_img_urls() #get a list of x number of paintings requested urls
get_data(page_urls) #gets info for every link in list
