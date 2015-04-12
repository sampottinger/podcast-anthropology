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
