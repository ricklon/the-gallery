import requests
import bs4 #parsing through html

main_url = 'http://www.metmuseum.org'
root_url = 'http://www.metmuseum.org/collection/the-collection-online'
search_term = 'Vincent+Van+Gogh' #put search term here. Replace spaces with +: Vincent+Van+Gogh. Not case sensitive
image_toggle = '&amp;ao=on&amp;noqs=true' #show only artwork with images. Default is true
collections_url = root_url + '/search?ft=' + search_term + image_toggle + '&rpp=30&pg='

#returns a list of urls for a given page
def get_img_urls(page):
		#Get the html doc
		response = requests.get(collections_url+str(page))
		#get text to edit
		soup = bs4.BeautifulSoup(response.text)
		#get all the links
		links = []
		for a in soup.select("div.list-view-object-info a"):
			if a.parent['class'][0] == 'gallery':
				continue #skip if a is not an actual painting
			links.append(a.attrs.get('href'))
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

index = 1
while index < 2:
	page_urls = get_img_urls(index) #list of urls for a given page
	get_data(page_urls) #gets info for every link in list
	index = index + 1
