import datetime
import json


DEFAULT_HEADERS = {'User-Agent': 'Digital Anthropology Podcast Crawler'}


# Thanks http://stackoverflow.com/questions/455580
class DateJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.date):
            return obj.isoformat()
        else:
            return super(DateJSONEncoder, self).default(obj)