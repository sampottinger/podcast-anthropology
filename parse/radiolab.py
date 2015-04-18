"""Logic to parse the RadioLab RSS feed for RadioLab episodes.

Logic and structures to parse more recent RadioLab episode metadata from their
WNYC RSS feed. Note that some episodes are too old and not included in the WYNC
feed so a second module (radiolab_old) is also provided.

This logic can be run from the command line with:
    
    python radiolab.py [JSON LOCATION]

Where the script will write parsed episode metadata to the provided JSON file
location.

Note that RadioLab is an external service (c) 2015 WNYC. We love our podcasters
and you should too. This is a tool meant for anthropological research. Please
use with the utmost love and care. <3

@author: Sam Pottinger
@license: MIT License
"""

import sys

import common
import bs4
import requests

RSS_LOC = 'http://feeds.wnyc.org/radiolab'

DEFAULT_HEADERS = {'User-Agent': 'Digital Anthropology Podcast Crawler'}

USAGE_STR = 'python radiolab.py [json location]'


def get_rss_raw():
    """Get the raw contents of the WNYC RSS feed.

    @return: Raw text content of the WNYC RSS feed.
    @rtype: basestring
    """
    return requests.get(RSS_LOC, headers=DEFAULT_HEADERS).text


def process_item(item_soup):
    """Parse information about a single podcast episode.

    @param item_soup: Soup containing information about a single podcast
        episode.
    @type item_soup: bs4.BeautifulSoup
    @return: Dictionary describing the episode. Contains keys name (str value),
        date (datetime.date), loc (url - str value), duration (seconds - int),
        and orig_tags (tags applied to episode - list of str)
    @rtype: dict
    """
    title = item_soup.find('title').contents[0].strip()
    loc = item_soup.find('guid').contents[0]

    pub_date_raw = item_soup.find('pubdate').contents[0]
    pub_date = common.interpret_2822_date(pub_date_raw)

    tags = map(
        lambda x: x.contents[0],
        item_soup.findAll('category')
    )

    duration_soup = item_soup.find('itunes:duration')
    if duration_soup == None:
        duration = 1800 if 'shorts' in tags else 3600
    else:
        duration_str = duration_soup.contents[0]
        duration = common.interpret_duration(duration_str)

    return {
        'name': title,
        'date': pub_date,
        'tags': sorted(set(tags)),
        'loc': loc,
        'duration': duration
    }


def serialize_rss_content(content):
    """Parse the content of the RSS feed as dictionaries describing episodes.

    @param content: Raw text content of the WYNC rss feed.
    @type content: basestring
    @return: Dictionary with an "epsidoes" key whose value is a list of
        dictionaries describing RadioLab episodes.
    @rtype: dict
    """
    soup = bs4.BeautifulSoup(content)
    channel_info = soup.find('rss').find('channel')
    return {
        'episodes': map(process_item, channel_info.findAll('item'))
    }


def parse_and_serialize_rss(location):
    """Download and parse WNYC feed data, saving results to a JSON file.

    @param location: File location where the parsed feed data should be saved.
    @type location: basestring
    """
    content = get_rss_raw()
    serialized = serialize_rss_content(content)
    serialized_str = common.DateJSONEncoder().encode(serialized)
    with open(location, 'w') as f:
        f.write(serialized_str)


def main():
    """Driver for the RadioLab episode parser."""
    if len(sys.argv) != 2:
        print USAGE_STR
        return

    location = sys.argv[1]
    parse_and_serialize_rss(location)


if __name__ == '__main__':
    main()
