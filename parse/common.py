""" Utility / convienence functions for parsing podcast feeds.

@author Sam Pottinger
@license MIT License
"""

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


def interpret_2822_date(date_str):
    """Interpret RFC 2822 date as a datetime.

    Interpret a string like "Mon, 05 Jun 2015 19:12:08 -0500" which contains a
    RFC 2822 date as a Python native datetime.date.

    @param date_str: String to interpret as a date.
    @type date_str: basestring
    @return: Parsed date from the given string
    @rtype: datetime.date
    """
    components = rfc822.parsedate_tz(date_str)
    return datetime.date(components[0], components[1], components[2])


def interpret_duration(duration_str):
    """Interpret a string describing the length of a podcast episode.

    Convert a string describing the length of a podcast episode (like "1:00")
    into an integer number of seconds (like 60).

    @param duration_str: The string encoding a duration to interpret.
    @type duration_str: basestring
    @return: Number of seconds duration described by the provided string.
    @rtype: int
    """
    components = duration_str.split(':')
    seconds = 0
    
    num_components = len(components)
    for i in range(0, num_components):
        component = components[i]
        seconds += int(component) * pow(60, (num_components - i - 1))

    return seconds


def get_noun_phrases(description_content):
    """Use nltk to get all of the noun phrases within an episode description.

    @param description_content: The text sample or episode description from
        which nouns should be extracted.
    @type description_content: basestring
    @return: List of noun phrases found in the provided text sample.
    @rtype: list of str
    """
    tokenized_description = nltk.word_tokenize(description_content)
    tokenized_description = nltk.pos_tag(tokenized_description)
    result = DEFAULT_CHUNKER.parse(tokenized_description)
    trees = filter(lambda x: type(x) == nltk.tree.Tree, result)
    noun_phrases = filter(lambda x: x.label() == 'NP', trees)

    return noun_phrases


def should_filter(target, stem_mapping, filtered_phrases):
    """Determine if a noun phrase should be included in the tags list.

    @param target: The noun phrase in question.
    @type target: basestring
    @param stem_mapping: Renaming of noun phrases through which target should
        be translated before tested for filtering.
    @type stem_mapping: dict (str to str)
    @param filtered_phrases: List of noun phrases to exclude.
    @type filtered_phrases: list of str
    """
    filtered = target in filtered_phrases
    filtered = filtered or stem_mapping[target] in filtered_phrases
    return filtered


def get_tags_by_nlp(description_content, replacements, stem_mapping,
    filtered_phrases):
    """Find the tags for a podcast episode given its text description.

    @param description_content: Text description of a podcast episode.
    @type description_content: basestring
    @param replacements: Dict mapping original substring and substring that it
        should be replaced with.
    @type replacements: dict (str to str)
    @param stem_mapping: Mapping from stems to human readable strings that
        should be reported.
    @type stem_mapping: dict (str to str)
    @param filtered_phrases: List of noun phrases to exclude as tags.
    @type filtered_phrases: list of str
    @return: List of tags parsed from the provided episode description.
    @rtype: list of str
    """
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
    """Reduce the set of tags for provided items given a minimum occurance.

    @param items: The podcasts for which the tags field needs to be set and
        whose candidate tags are saved to orig_tags.
    @type items: list of dict with orig_tags key
    @param stem_mapping: Mapping from stem to human-readable text for tags.
    @type stem_mapping: dict (str to str)
    @param count_threshold: The minimum number of times a tag must occur across
        all episodes for it to be included in the list of tags.
    @type count_threshold: int
    """
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


class DateJSONEncoder(json.JSONEncoder):
    """JSON encoder for datetime.date.

    @see http://stackoverflow.com/questions/455580
    """

    def default(self, obj):
        if isinstance(obj, datetime.date):
            return obj.isoformat()
        else:
            return super(DateJSONEncoder, self).default(obj)
