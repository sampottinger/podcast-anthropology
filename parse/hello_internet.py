import collections
import sys

import bs4
import nltk
import requests

import common


STEMMER = nltk.stem.snowball.SnowballStemmer('english')
RSS_URL = 'http://feeds.podtrac.com/m2lTaLRx8AWb'
TAG_TYPES = ['NN', 'NNP', 'NNS', 'NNPS']
TAG_COUNT_THRESHOLD = 1
DEFAULT_CHUNK_PATTERN = """
  NP:
      {<JJ>*<DT|PP\$>?(<NN>|<NNP>|<NNS>|<NNPS>)+}
      {(<NN>|<NNP>|<NNS>|<NNPS>)+}
"""
DEFAULT_CHUNKER =  nltk.RegexpParser(DEFAULT_CHUNK_PATTERN) 
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


def get_noun_phrases(description_content):
    tokenized_description = nltk.word_tokenize(description_content)
    tokenized_description = nltk.pos_tag(tokenized_description)
    result = DEFAULT_CHUNKER.parse(tokenized_description)
    trees = filter(lambda x: type(x) == nltk.tree.Tree, result)
    noun_phrases = filter(lambda x: x.label() == 'NP', trees)

    return noun_phrases


def should_filter(target, stem_mapping):
    filtered = target in FILTERED_PHRASES
    filtered = filtered or stem_mapping[target] in FILTERED_PHRASES
    return filtered


def get_item_tags(title, item_soup, stem_mapping):
    description_content = title + '. ' + get_description_content(item_soup)
    description_content = description_content.lower()
    
    description_content = description_content.replace('(', '')
    description_content = description_content.replace(')', '')
    description_content = description_content.replace('-', '')
    description_content = description_content.replace('/', '')

    for replacement in PHRASE_REPLACEMENTS:
        description_content = description_content.replace(
            replacement,
            PHRASE_REPLACEMENTS[replacement]
        )
    
    noun_phrases = get_noun_phrases(description_content)
    noun_phrases_flat = []
    for tree in noun_phrases:
        components = map(lambda x: x[0].encode('ascii', 'ignore'), tree)
        stemmed_components = map(lambda x: STEMMER.stem(x), components)
        
        stemmed_phrase = ' '.join(stemmed_components)
        orig_phrase = ' '.join(components)
        
        stem_mapping[stemmed_phrase] = orig_phrase
        noun_phrases_flat.append(' '.join(stemmed_components))

    noun_phrases_flat = filter(
        lambda x: not should_filter(x, stem_mapping),
        noun_phrases_flat
    )

    return sorted(set(noun_phrases_flat))


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


def consolidate_tags(items, stem_mapping):
    counts = collections.defaultdict(lambda: 0)
    for item in items:
        for tag in item['orig_tags']:
            counts[tag] = counts[tag] + 1

    for item in items:
        tag_stems = filter(
            lambda x: counts[x] > TAG_COUNT_THRESHOLD,
            item['orig_tags']
        )
        item['tags'] = map(lambda x: stem_mapping[x], tag_stems)


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

    consolidate_tags(new_items, stem_mapping)

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
