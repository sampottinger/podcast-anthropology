import collections
import datetime
import json
import rfc822

import nltk


DEFAULT_HEADERS = {'User-Agent': 'Digital Anthropology Podcast Crawler'}

STEMMER = nltk.stem.snowball.SnowballStemmer('english')
TAG_TYPES = ['NN', 'NNP', 'NNS', 'NNPS']
TAG_COUNT_THRESHOLD = 1
DEFAULT_CHUNK_PATTERN = """
  NP:
      {<JJ>*<DT|PP\$>?(<NN>|<NNP>|<NNS>|<NNPS>)+}
      {(<NN>|<NNP>|<NNS>|<NNPS>)+}
"""
DEFAULT_CHUNKER =  nltk.RegexpParser(DEFAULT_CHUNK_PATTERN)

MONTH_ABBRV = {
    'Jan': 1,
    'Feb': 2,
    'Mar': 3,
    'Apr': 4,
    'May': 5,
    'Jun': 6,
    'Jul': 7,
    'Aug': 8,
    'Sep': 9,
    'Oct': 10,
    'Nov': 11,
    'Dec': 12
}


def interpret_822_date(date_str):
    components = rfc822.parsedate_tz(date_str)
    return datetime.date(components[0], components[1], components[2])


def interpret_duration(duration_str):
    components = duration_str.split(':')
    seconds = 0
    
    num_components = len(components)
    for i in range(0, num_components):
        component = components[i]
        seconds += int(component) * pow(60, (num_components - i - 1))

    return seconds


def get_noun_phrases(description_content):
    tokenized_description = nltk.word_tokenize(description_content)
    tokenized_description = nltk.pos_tag(tokenized_description)
    result = DEFAULT_CHUNKER.parse(tokenized_description)
    trees = filter(lambda x: type(x) == nltk.tree.Tree, result)
    noun_phrases = filter(lambda x: x.label() == 'NP', trees)

    return noun_phrases


def should_filter(target, stem_mapping, filtered_phrases):
    filtered = target in filtered_phrases
    filtered = filtered or stem_mapping[target] in filtered_phrases
    return filtered


def get_tags_by_nlp(description_content, replacements, stem_mapping,
    filtered_phrases):
    description_content = description_content.lower()
    
    description_content = description_content.replace('(', '')
    description_content = description_content.replace(')', '')
    description_content = description_content.replace('-', '')
    description_content = description_content.replace('/', '')

    for replacement in replacements:
        description_content = description_content.replace(
            replacement,
            replacements[replacement]
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
        lambda x: not should_filter(x, stem_mapping, filtered_phrases),
        noun_phrases_flat
    )

    return sorted(set(noun_phrases_flat))


def consolidate_tags(items, stem_mapping, count_threshold):
    counts = collections.defaultdict(lambda: 0)
    for item in items:
        for tag in item['orig_tags']:
            counts[tag] = counts[tag] + 1

    for item in items:
        tag_stems = filter(
            lambda x: counts[x] > count_threshold,
            item['orig_tags']
        )
        item['tags'] = map(lambda x: stem_mapping[x], tag_stems)


# Thanks http://stackoverflow.com/questions/455580
class DateJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.date):
            return obj.isoformat()
        else:
            return super(DateJSONEncoder, self).default(obj)
