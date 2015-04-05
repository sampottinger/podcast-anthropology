import sys

import bs4
import nltk
import requests

import common


RSS_URL = 'http://feeds.podtrac.com/m2lTaLRx8AWb'
TAG_TYPES = ['NN', 'NNP', 'NNS', 'NNPS']
DEFAULT_CHUNK_PATTERN = 'NP: {<CD>?<DT>?(<JJ>|<NN>|<NNP>)*<POS>?(<NN>+|<NNS>|<NNP>)}'
DEFAULT_CHUNKER =  nltk.RegexpParser(DEFAULT_CHUNK_PATTERN) 
FILTERED_PHRASES = [
    'bit grumpy',
    'nonetheless',
    'grey',
    'cgp grey',
    'brady'
]
MAPPED_PHRASES = {
    'crash corner': 'plane crash corner'
}
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


def get_noun_phrases(description_content):
    tokenized_description = nltk.word_tokenize(description_content)
    tokenized_description = nltk.pos_tag(tokenized_description)
    result = DEFAULT_CHUNKER.parse(tokenized_description)
    trees = filter(lambda x: type(x) == nltk.tree.Tree, result)
    noun_phrases = filter(lambda x: x.label() == 'NP', trees)

    return noun_phrases


def get_item_tags(item_soup):
    description_content = get_description_content(item_soup)
    
    description_content = description_content.replace('(', '')
    description_content = description_content.replace(')', '')
    description_content = description_content.replace('-', '')
    description_content = description_content.replace('/', '')
    
    noun_phrases = get_noun_phrases(description_content)
    noun_phrases_flat = []
    for tree in noun_phrases:
        components = map(lambda x: x[0], tree)
        noun_phrases_flat.append((' '.join(components)).lower())

    filtered_noun_phrases = filter(
        lambda x: not x in FILTERED_PHRASES,
        noun_phrases_flat
    )

    mapped_noun_phrases = map(
        lambda x: MAPPED_PHRASES[x] if x in MAPPED_PHRASES else x,
        filtered_noun_phrases
    )

    ascii_noun_phrases = map(
        lambda x: x.encode('ascii', 'ignore'),
        mapped_noun_phrases
    )

    return sorted(set(ascii_noun_phrases))


def parse_item(item_soup):
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
        'tags': get_item_tags(item_soup)
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

    return map(
        lambda x: parse_item(x),
        new_item_soups
    )


def main():
    if len(sys.argv) != 2:
        print USAGE_STR
        return

    #content = get_rss_content()
    with open('hello_internet_snap') as f:
        content = f.read()
    soup = bs4.BeautifulSoup(content)
    items = parse_new_items(soup, {})

    out_location = sys.argv[1]

    with open(out_location, 'w') as f:
        out_str = common.DateJSONEncoder().encode({'episodes': items})
        f.write(out_str)


if __name__ == '__main__':
    main()
