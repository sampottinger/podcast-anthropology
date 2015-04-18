"""Logic and structures to parse episodes from The Memory Palace.

Logic and structures to parse the episodes from The Memory Palace which can be
operated from the command line with the following usage:

    python memory_palace [JSON FILE]

The json file location passed as the only argument to the script indicates where
this program should write the episode information downloaded from the podcast's
website.

Note that The Memory Palance is an external service (c) 2015 Nate DiMeo. We love
our podcasters and you should too. This is a tool meant for anthropological
research. Please use with the utmost love and care. <3

@author: Sam Pottinger
@license: MIT License
"""

import common
import datetime
import sys

import requests

import bs4

INDEX_ROOT_LOC = 'http://thememorypalace.us/category/episodes/'
USAGE_STR = 'python memory_palace.py [json file]'


def download_index_page(loc):
    """Download the HTML listing of podcast episodes.

    @param loc: The location of the HTML page with podcast episodes.
    @type loc: basestring
    @return: Raw text of the HTML page with podcast episodes.
    @rtype: basestring
    """
    return requests.get(loc, headers=common.DEFAULT_HEADERS).text


def parse_index_page(contents):
    """Get links to the episodes from The Memory Palace.

    @param contents: The podcast episodes listing page to parse.
    @type contents: basestring
    @return: Listing of links to all of the episodes from The Memory Palace
    @rtype: list of str
    """
    soup = bs4.BeautifulSoup(contents)
    links = soup.findAll(class_='centerPosts')
    return map(lambda x: x['href'], links)


def get_next_page(contents):
    """Operate pagination to go to the next page of episodes.

    The Memory Palace uses pagination to separate out its list of podcast
    episodes so the index page parsing needs to be executed many times (once
    per index page). This method finds the next page to parse if any.

    @param contents: Contents of the current page of podcast episodes.
    @type contents: basestring
    @return: The URL for the next page of podcast episodes or None if no
        additional index pages exist.
    @rtype: basestring
    """
    soup = bs4.BeautifulSoup(contents)
    page_section = soup.find(class_='nav-paged')
    links = page_section.findAll('a')
    next_page_links = filter(
        lambda x: 'Older' in x.contents[0],
        links
    )

    if len(next_page_links) == 0:
        return None
    else: 
        return next_page_links[0]['href']


def parse_episode_page(loc, contents):
    """Parse a page describing a single podcast episode.

    @param loc: The URL of this page.
    @type loc: basestring
    @param contents: The raw HTML contents of the episode page from which
        episode information should be parsed.
    @type contents: basestring
    @return: Dictionary describing the episode. Contains keys name (str value),
        date (datetime.date), loc (url - str value), duration (seconds - int),
        and orig_tags (tags applied to episode - list of str)
    @rtype: dict
    """
    soup = bs4.BeautifulSoup(contents)
    header = soup.find(class_='centerPosts')
    title = header.find('strong').contents[0]

    date_str = soup.find(class_='pdateS').find('em').contents[0]
    date_components = date_str.replace(',', ' ').split(' ')
    
    year = int(date_components[2])
    month = common.MONTH_ABBRV[date_components[0]]
    day = int(date_components[1])
    episode_date = datetime.date(year, month, day)

    tags = sorted(set(map(
        lambda x: x.contents[0], soup.findAll('a', rel='tag')
    )))

    duration_str = soup.find(class_='podpress_mediafile_dursize').contents[0]
    duration_str_clean = duration_str.replace('[ ', '').replace(' ]', '')
    duration = common.interpret_duration(duration_str_clean)

    return {
        'title': title,
        'date': episode_date,
        'tags': tags,
        'loc': loc,
        'duration': duration
    }


def main():
    """Driver for the memory palace parser."""
    if len(sys.argv) != 2:
        print USAGE_STR
        return

    next_page = INDEX_ROOT_LOC
    locations = []
    while next_page != None:
        contents = download_index_page(next_page)
        locations.extend(parse_index_page(contents))
        next_page = get_next_page(contents)

    page_contents = map(
        lambda x: (x, requests.get(x, headers=common.DEFAULT_HEADERS).text),
        locations
    )

    episode_info = map(
        lambda (loc, contents): parse_episode_page(loc, contents),
        page_contents
    )

    out_location = sys.argv[1]
    with open(out_location, 'w') as f:
        serialized_str = common.DateJSONEncoder().encode({
            'episodes': episode_info
        })
        f.write(serialized_str)


if __name__ == '__main__':
    main()
