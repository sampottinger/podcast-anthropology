"""Logic to combine multiple JSON files describing podcast episodes.

Logic to combine multiple podcast episode listings across different JSON file
using a mapping that renames different episode tags, combining like tags into
single categories for easier processing and visualization. This script can be
used to take JSON files describing different podcasts and create a single
JSON file where each podcast's shows are still separated but in the same
(standardized) format.

This program can be run stand-alone with the following usage:
    
    python combine.py [SOURCE FILES LISTING] [TAG MAPPING] [OUT JSON]

Parameters include:
    - Location of a JSON file containing a single object whose keys are the
      names of podcasts (like "This American Life") and whose values are file
      paths to source JSON files that should be combined together.
    - Location of a JSON file continaing a single object whose keys are tags
      (strings) and whose values are to what those tags should be renamed.
    - Location to where the combined JSON file should be written.

@author: Sam Pottinger
@license: MIT License
"""

import collections
import json

USAGE_STR = 'python combine.py [source files listing] [tag mapping] [out json]'


def clean_episode(episode):
    """Standardize the properties of an episode record.

    Different podcasts and podcast parsing logic can result in minor differences
    in the description of epsiodes. This tries to standardize reporting of the
    podcast attributes.

    @param episode: Dictionary describing a single episode that should be
        standardized.
    @type episode: dict
    @return: Dictionary describing the same episode after standardizing
        reporting of episode properties.
    @rtype: dict
    """
    return {
        'name': episode['name'],
        'date': episode['date'],
        'loc': episode['loc'],
        'duration': episode['duration'],
        'tags': map(lambda x: x.lower(), episode['tags'])
    }


def read_show_episodes(loc):
    """Read all of the episodes contained within a source JSON file.

    @param loc: The location of the JSON file describing episodes from a
        podcast.
    @type loc: basestring
    @return: List of episodes read from the source JSON file after being
        "standardized" to have episode properties reported in a consistent way.
    @rtype: list of dict
    """
    with open(loc) as f:
        contents = json.load(f)

    return map(clean_episode, contents['episodes'])


def parse_show(name, loc, tag_mapping, global_tags):
    """Organize information about a podcast's episodes, mapping tags as needed.

    Combine information about all episodes from a podcast, mapping show tags
    as needed for standardization.

    @param name: The name of the podcast (like This American Life).
    @type name: basestring
    @param loc: The JSON file where thie podcast's epsiodes are saved.
    @type loc: basestring
    @return: Dictionary describing a single show with a show key indicating the
        name of the podcast (like This American Life) and an episodes key whose
        value is a list of dictionaries where each dictionary describes a single
        podcast episode.
    """
    episodes = read_show_episodes(loc)

    total_duration = 0

    for episode in episodes:
        episode['show'] = name
        episode['tags'] = map(
            lambda x: tag_mapping[x] if x in tag_mapping else x
            episode['tags']
        )

        total_duration += episode['duration']
        
        for tag in episode['tags']:
            global_tag_entry = global_tags[tags]
            global_tag_entry['num_episodes'] += 1
            global_tag_entry['duration'] += episode['duration']

    show_entry = {
        'episodes': len(episodes),
        'duration': total_duration,
        'name': name
    }

    return {
        'show': show_entry,
        'episodes': episodes
    }


def parse_shows(source_files, tag_mapping):
    """Parse all podcasts' shows and combine them into a single dictionary.

    @param source_files: Dictionary describing the files containing episodes for
        each podcast. This should map the name of the podcast (like This
        American Life) to a file location where the individual episode
        information can be found.
    @type source_files: dict
    @param tag_mapping: Dictionary mapping the original name of a tag to what
        that tag should be called in the output file.
    @type tag_mapping: dict
    @return: Dictionary with all shows, episodes, and tags from all of the
        provided souce files after applying the provided tag mapping.
    @rtype: dict
    """
    episodes = []
    shows = []
    tags_dict = collections.defaultdict()

    for (show_name, show_loc) in source_files.entries():
        parse_results = parse_show(show_name, show_loc, tag_mapping, tags_dict)
        episodes.entend(parse_results['episodes'])
        shows.append(parse_results['show'])

    tags = []
    for (tag_name, tag_info) in tags_dict.entries():
        tags.append({
            'name': tag_name,
            'num_episodes': tag_info['num_episodes'],
            'duration': tag_info['duration']
        })

    return {
        'episodes': episodes,
        'shows': shows,
        'tags': tags
    }


def main():
    """Driver for the combine program."""
    if len(sys.argv) != 4:
        print USAGE_STR
        return

    source_file_loc = sys.argv[1]
    tag_mapping_loc = sys.argv[2]
    out_json_loc = sys.argv[3]

    with open(source_file_loc) as f:
        source_files = json.load(f)

    with open(tag_mapping_loc) as f:
        tag_mapping = json.load(f)

    combined_info = parse_shows(source_files, tag_mapping)

    with open(out_json_loc) as f:
        json.dump(combined_info, f)


if __name__ == '__main__':
    main()
