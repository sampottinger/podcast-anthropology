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
    return requests.get(RSS_URL, headers=common.DEFAULT_HEADERS).text


def get_description_content(item_soup):
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
    description_content = title + '. ' + get_description_content(item_soup)
    return common.get_tags_by_nlp(
        description_content,
        PHRASE_REPLACEMENTS,
        stem_mapping,
        FILTERED_PHRASES
    )


def parse_item(item_soup, stem_mapping):
    item_date = common.interpret_822_date(item_soup.find('pubdate').contents[0])
    
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
