"""Logic and structures to download podcast Hello Internet episode information.

Logic and structures to download podcast Hello Internet episode information
which can be operated from the command line with the following usage:

    python hello_internet.py [JSON FILE LOCATION]

This program will write the parsed episode information to a JSON file at the
provided file location, overwriting any prior file content.

Note that HI is an external service (c) 2015 CGP Grey and Brady Haran. We love
our podcasters and you should too. This is a tool meant for anthropological
research. Please use with the utmost love and care. <3

@author: Sam Pottinger
@license: MIT License
"""

import collections
import sys

import bs4
import requests

import common


RSS_URL = 'http://feeds.podtrac.com/m2lTaLRx8AWb' 
FILTERED_PHRASES = [
    'bit grumpy',
    'nonetheless',
    'grey',
    'cgp grey',
    'brady',
    'h.i.',
    'discuss',
    'hello internet',
    'people',
    'ions',
    'ion',
    'talk',
    'things',
    'words',
    'word',
    'bit',
    'a box',
    'h.i',
    'import',
    'box grey',
    'bit',
    'thing',
    'this episode'
]
PHRASE_REPLACEMENTS = {'the star wars': 'star wars'}
USAGE_STR = 'python hello_internet.py [out json file]'


def get_rss_content():
    """Get Hello Internet episodes from the HI RSS feed.

    @return: Raw string contents of the HI RSS feed.
    @rtype: basestring
    """
    return requests.get(RSS_URL, headers=common.DEFAULT_HEADERS).text


def get_description_content(item_soup):
    """Get the description of an episode

    @param item_soup: Soup containing a single podcast episode.
    @type item_soup: bs4.BeautifulSoup
    """
    description_soup = item_soup.find('description')
    header_soup = description_soup.find('h2')

    if header_soup:
        next_sibling = header_soup.previousSibling
        content = ''
        
        while next_sibling != None:
            if type(next_sibling) == bs4.element.Tag:
                content = next_sibling.getText() + content
            else:
                content = next_sibling + content

            next_sibling = next_sibling.previousSibling
        
        return content.strip()
    else:
        return description_soup.getText().strip()


def get_item_tags(title, item_soup, stem_mapping):
    """Get the tags for an episode.

    @param title: The title of the episode.
    @type title: basestring
    @param item_soup: Soup containing episode information.
    @type item_soup: bs4.BeautifulSoup
    @param stem_mapping: Mapping renaming stems for nlptk.
    @type stem_mapping: dict (str to str)
    """
    description_content = title + '. ' + get_description_content(item_soup)
    return common.get_tags_by_nlp(
        description_content,
        PHRASE_REPLACEMENTS,
        stem_mapping,
        FILTERED_PHRASES
    )


def parse_item(item_soup, stem_mapping):
    """Get information about a single HI episode.

    @param item_soup: Soup containing information about a single HI episode.
    @type item_soup: bs4.BeautifulSoup
    @return: Dictionary describing the episode. Contains keys name (str value),
        date (datetime.date), loc (url - str value), duration (seconds - int),
        and orig_tags (tags applied to episode - list of str)
    @rtype: dict
    """
    item_date = common.interpret_2822_date(
        item_soup.find('pubdate').contents[0]
    )
    
    duration_soup = item_soup.find('itunes:duration')
    if duration_soup:
        duration = common.interpret_duration(
            item_soup.find('itunes:duration').contents[0]
        )
    else:
        duration = 7200

    title = item_soup.find('title').contents[0]
    
    return {
        'name': title,
        'date': item_date,
        'loc': '',
        'duration': duration,
        'orig_tags': get_item_tags(title, item_soup, stem_mapping)
    }


def parse_new_items(soup, existing_content_by_name):
    """Prase all podcast episodes from the RSS feed.

    @param soup: Soup with all podcast episodes.
    @type soup: bs4.BeautifulSoup
    @param existing_content_by_name: Collection with the names of HI epsiodes
        already parsed.
    @type existing_content_by_name: Collection of str
    """
    items_soup = soup.findAll('item')

    item_soups_with_name = map(
        lambda x: (x.find('title').contents[0], x),
        items_soup
    )

    new_item_soups_with_name = filter(
        lambda (name, soup): not name in existing_content_by_name,
        item_soups_with_name
    )

    new_item_soups = map(lambda x: x[1], new_item_soups_with_name)

    stem_mapping = {}

    new_items = map(
        lambda x: parse_item(x, stem_mapping),
        new_item_soups
    )

    common.consolidate_tags(new_items, stem_mapping, 1)

    return new_items


def main():
    """Driver for the Hello Internet parser."""
    if len(sys.argv) != 2:
        print USAGE_STR
        return

    content = get_rss_content()
    soup = bs4.BeautifulSoup(content)
    items = parse_new_items(soup, {})

    out_location = sys.argv[1]

    with open(out_location, 'w') as f:
        out_str = common.DateJSONEncoder().encode({'episodes': items})
        f.write(out_str)


if __name__ == '__main__':
    main()
