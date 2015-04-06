import collections
import json

USAGE_STR = 'python combine.py [source files listing] [tag mapping] [out json]'


def clean_episode(episode):
    return {
        'name': episode['name'],
        'date': episode['date'],
        'loc': episode['loc'],
        'duration': episode['duration'],
        'tags': map(lambda x: x.lower(), episode['tags'])
    }


def read_show_episodes(loc):
    with open(loc) as f:
        contents = json.load(f)

    return map(clean_episode, contents['episodes'])


def parse_show(name, loc, tag_mapping, global_tags):
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
