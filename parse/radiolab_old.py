import bs4
import datetime
import re
import sys

import requests

import common

ROOT_PAGE = 'http://www.radiolab.org/series/podcasts/'
PAGE_URL_TEMPLATE = 'http://www.radiolab.org/series/podcasts/%d/'
DATE_TAG_REGEX = re.compile(
    '''\<Attribute name\=\"sort\" value\=\"(\d+)\"\/\>'''
)

SHORTS_LENGTH = 1853
FULL_LENGTH = 3480

USAGE_STR = 'python radiolab_old.py [json file] [start radiolab page]'


def read_root_index_page():
    return requests.get(ROOT_PAGE, headers=common.DEFAULT_HEADERS).text


def enumerate_page_locations(start_page, content):
    soup = bs4.BeautifulSoup(content)
    link_containers = soup.findAll(class_='pagefooter-link')
    links = map(lambda x: x.find('a'), link_containers)
    link_contents = map(lambda x: int(x.contents[0]), links)
    page_numbers = range(start_page, max(link_contents) + 1)
    return map(lambda x: PAGE_URL_TEMPLATE % x, page_numbers)


def read_index_page(content):
    soup = bs4.BeautifulSoup(content)
    items = soup.findAll(class_='series-item')
    headers = map(lambda x: x.find(class_='title'), items)
    links = map(lambda x: x.find('a')['href'], headers)
    return links


def interpret_date(date_str):
    year = int(date_str[:4])
    month = int(date_str[4:6])
    day = int(date_str[6:])
    return datetime.date(year, month, day)


def read_episode_page(loc, content):
    date_str = DATE_TAG_REGEX.search(content).group(1)
    episode_date = interpret_date(date_str)

    soup = bs4.BeautifulSoup(content)
    header = soup.find(class_='story-headergroup')
    title = header.find(class_='title').contents[0].strip()

    tags_section = soup.find(class_='article-bottom-tags')
    tags = map(
        lambda x: x.contents[0].strip(),
        tags_section.findAll('a')
    )

    duration = 0
    if 'shorts' in tags: duration = SHORTS_LENGTH
    else: duration = FULL_LENGTH

    return {
        'name': title,
        'date': episode_date,
        'tags': tags,
        'loc': loc,
        'duration': duration
    }


def main():
    if len(sys.argv) != 3:
        print USAGE_STR
        return

    out_file_loc = sys.argv[1]

    start_page = int(sys.argv[2])
    content = read_root_index_page()
    index_locations = enumerate_page_locations(start_page, content)

    episode_locations = []
    for index_location in index_locations:
        resp = requests.get(index_location, headers=common.DEFAULT_HEADERS)
        content = resp.text
        episode_locations.extend(read_index_page(content))

    episode_info = []
    for episode_location in episode_locations:
        resp = requests.get(episode_location, headers=common.DEFAULT_HEADERS)
        content = resp.text
        episode_info.append(read_episode_page(episode_location, content))

    with open(out_file_loc, 'w') as f:
        serialized_str = common.DateJSONEncoder().encode(
            {'episodes': episode_info}
        )
        f.write(serialized_str)


if __name__ == '__main__':
    main()
