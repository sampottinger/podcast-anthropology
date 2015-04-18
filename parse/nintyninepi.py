"""Logic and structures to download podcast information for 99pi.

Logic and structures to download and parse podcast information for 99 Percent
Invisible. This can be run from the command line with the following usage:

    python nintyninepi.py [OUTPUT JSON FILE]

The script will write the parsed episode information to the provided disk
location, overwriting any existing contents in that target file.

Note that 99 Percent Invisible is an external service (c) 99 Percent Invisible.
We love our podcasters and you should too. This is a tool meant for
anthropological research. Please use with the utmost love and care. <3

@author: Sam Pottinger
@license: MIT License
"""


import datetime
import sys

import common

import soundcloud

USAGE_STR = 'python nintyninepi.py [out json file]'
FILTERED_PHRASES = [
    'help',
    'producer',
    'producers',
    'show',
    'the words',
    'years',
    'the thing',
    'course',
    'thanks',
    'find',
    'a way',
    'group',
    'the field',
    'someone',
    'means',
    'a man',
    'effects',
    'the problem',
    'day',
    'apart',
    'feet',
    'events',
    'the form',
    'miles',
    'night',
    'new book',
    'everyone',
    'people',
    'http',
    'happens',
    'a lot',
    'lots',
    'sam greenspan',
    'everything',
    'this week',
    'attention',
    'some point',
    'a group',
    'legend',
    'the face',
    'a tour',
    'host',
    'theres',
    'thats',
    'whats',
    'point',
    'reporters',
    'an episode',
    'this episode',
    'another way',
    'guests',
    'pulls',
    'a place',
    'the area',
    'anyone',
    'the course',
    'way',
    'today',
    'season',
    'part',
    'lives',
    'this story',
    'a tiny radio show',
    'anything',
    'inside',
    'the year',
    'pieces',
    'something',
    'the idea',
    'dennis',
    'all kinds',
    '%',
    'thousands',
    'the difference',
    'a piece',
    'a story',
    'plenty',
    'nothing',
    'the way',
    'the story',
    'sale',
    'fact',
    'the university',
    'its',
    'hands',
    'decades',
    'the space',
    'the show',
    'turns',
    'the end',
    'this piece',
    'things',
    'ideas',
    'book',
    'episode',
    'person',
    '% invisibile'
]
MAPPED_PHRASES = {
    'the architecture': 'architecture',
    'a building': 'building',
    'modern world': 'world',
    'the world': 'world',
    'the history': 'history',
    'the future': 'future',
    'the country': 'country',
    'the internet': 'internet',
    'a design': 'design',
    'the sound': 'sound',
    'a monument': 'monument',
    'the city': 'cities',
    'the place': 'place',
    'dollars': 'money',
    'the building': 'architecture',
    'an architect': 'architects',
    'a place': 'place',
    'the game': 'game',
    'a book': 'book',
    'the author': 'author',
    'a time': 'time',
    'the time': 'time',
    'a ship': 'ship',
    'the name': 'name',
    'invisible activity': 'invisibile',
    'the air': 'air',
    'the walls': 'walls',
    'the system': 'system',
    'an engineer': 'engineer',
    'the people': 'public',
    'the public': 'public',
    'the design': 'design',
    'the home': 'home',
    'structural engineers': 'engineer'
}


def load_tracks():
    """Load information about the 99pi episodes from Sound Cloud.

    @return: List of episodes from Sound Cloud with their episode metadata.
    @rtype: List of dict
    """
    with open('soundcloudkey.txt') as f:
        client_id = f.read().replace('\n', '')
        client = soundcloud.Client(client_id=client_id)

    offset = 0
    has_next = True
    
    tracks = []
    while has_next:
        new_tracks_info = client.get(
            '/users/5539303/tracks',
            limit=50,
            order='created_at',
            linked_partitioning=1,
            offset=offset
        )
        has_next = 'next_href' in new_tracks_info.fields()

        offset += 50
        tracks.extend(new_tracks_info.fields()['collection'])

    return tracks


def interpret_99pi_date(target):
    """Interpret the date of episode posting.

    @param target: String describing the posting date as parsed from Sound
        Cloud.
    @type target: basestring
    @return: Date representing the posting date of the episode as parsed from
        Sound Cloud.
    @rtype: datetime.date
    """
    major_components = target.split(' ')
    date_components = map(lambda x: int(x), major_components[0].split('/'))
    return datetime.date(
        date_components[0],
        date_components[1],
        date_components[2]
    )


def process_track(target, stem_mapping):
    """Process a single episode from the 99pi Sound Cloud listing.

    @param target: The track listing returned from the Sound Cloud API.
    @type target: dict
    @return: Dictionary describing the episode. Contains keys name (str value),
        date (datetime.date), loc (url - str value), duration (seconds - int),
        and orig_tags (tags applied to episode - list of str)
    @rtype: dict
    """
    name = target['title'].replace('99% Invisible-', '')
    date = interpret_99pi_date(target['created_at'])
    loc = target['permalink']
    duration = target['duration'] / 1000
    tags = common.get_tags_by_nlp(
        target['description'],
        MAPPED_PHRASES,
        stem_mapping,
        FILTERED_PHRASES
    )

    return {
        'name': name,
        'date': date,
        'loc': loc,
        'duration': duration,
        'orig_tags': tags
    }


def main():
    """Driver for the 99 Percent Invisible parser."""
    if len(sys.argv) != 2:
        print USAGE_STR
        return

    raw_tracks_info = load_tracks()

    stem_mapping = {}
    processed_tracks = map(
        lambda x: process_track(x, stem_mapping),
        raw_tracks_info
    )

    common.consolidate_tags(processed_tracks, stem_mapping, 2)

    with open(sys.argv[1], 'w') as f:
        f.write(common.DateJSONEncoder().encode({
            'episodes': processed_tracks
        }))


if __name__ == '__main__':
    main()
