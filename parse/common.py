import datetime
import json
import rfc822


DEFAULT_HEADERS = {'User-Agent': 'Digital Anthropology Podcast Crawler'}

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


# Thanks http://stackoverflow.com/questions/455580
class DateJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.date):
            return obj.isoformat()
        else:
            return super(DateJSONEncoder, self).default(obj)
