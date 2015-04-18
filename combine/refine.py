"""Short program renaming episode tags within a JSON file.

Usage: python refine.py [TAG MAPPING] [TARGET FILE]

Will open the JSON file at TARGET FILE and, in place, rename all tags matching
keys in TAG MAPPING to the corresponding values in TAG MAPPING where TAG MAPPING
is the location of a JSON file describing how tags should be renamed.

@author: Sam Pottinger
@license: MIT License
"""

import json
import sys

tag_mapping_src = sys.argv[1]
target_file = sys.argv[2]

with open(tag_mapping_src) as f:
    tag_mapping = json.load(f)

with open(target_file) as f:
    target = json.load(f)

for episode in target['episodes']:
    tags = episode['tags']
    tags = map(lambda x: tag_mapping[x] if x in tag_mapping else x, tags)
    tags = sorted(set(tags))
    episode['tags'] = tags

with open(target_file, 'w') as f:
    json.dump(target, f)
