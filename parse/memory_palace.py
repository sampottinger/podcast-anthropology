import common
import datetime
import sys

import requests

import bs4

INDEX_ROOT_LOC = 'http://thememorypalace.us/category/episodes/'
USAGE_STR = 'python memory_palace.py [json file]'


def download_index_page(loc):
    return requests.get(loc, headers=common.DEFAULT_HEADERS).text


def parse_index_page(contents):
    soup = bs4.BeautifulSoup(contents)
    links = soup.findAll(class_='centerPosts')
    return map(lambda x: x['href'], links)


def get_next_page(contents):
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
    if len(sys.argv) != 2:
        print USAGE_STR
        return

    next_page = INDEX_ROOT_LOC
    locations = []
    while next_page != None:
        contents = download_index_page(next_page)
        locations.extend(parse_index_page(contents))
        next_page = get_next_page(contents)

    print len(locations)
    locations = locations[:2]

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
