import sys

import common
import bs4
import requests

RSS_LOC = 'http://feeds.wnyc.org/radiolab'

DEFAULT_HEADERS = {'User-Agent': 'Digital Anthropology Podcast Crawler'}

USAGE_STR = 'python radiolab.py [json location]'


def get_rss_raw():
    return requests.get(RSS_LOC, headers=DEFAULT_HEADERS).text


def process_item(item_soup):
    title = item_soup.find('title').contents[0].strip()
    loc = item_soup.find('guid').contents[0]

    pub_date_raw = item_soup.find('pubdate').contents[0]
    pub_date = common.interpret_822_date(pub_date_raw)

    tags = map(
        lambda x: x.contents[0],
        item_soup.findAll('category')
    )

    duration_soup = item_soup.find('itunes:duration')
    if duration_soup == None:
        duration = 0
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
    soup = bs4.BeautifulSoup(content)
    channel_info = soup.find('rss').find('channel')
    return {
        'episodes': map(process_item, channel_info.findAll('item'))
    }


def parse_and_serialize_rss(location):
    content = get_rss_raw()
    serialized = serialize_rss_content(content)
    serialized_str = common.DateJSONEncoder().encode(serialized)
    with open(location, 'w') as f:
        f.write(serialized_str)


def main():
    if len(sys.argv) != 2:
        print USAGE_STR
        return

    location = sys.argv[1]
    parse_and_serialize_rss(location)


if __name__ == '__main__':
    main()
