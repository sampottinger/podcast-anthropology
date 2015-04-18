"""This American Life podcast history gatherer for Podcast Anthropology.

Logic to download and parse the history of the This American Life podcast as
part of the Podcast Anthropology research project. This gathers the publication
date, location (URL), tags, and name of each podcast in the history of "TAL"
from its first episode in 1995, serializing to a JSON file.

This program can be run stand-alone with the following:

    python tal.py [json location] [all|new]

Parameters include:
    - json location: The file location where the serialization should be saved.
    - all|new: Pass "all" to download the entire history. Pass "new" to update
        the JSON file at json location. This will not download episodes already
        parsed to be a good net citizen.

Note that TAL is an external service (c) 1995 - 2015 Chicago Public Media & Ira
Glass. We love our podcasters and you should to. This is a tool meant for
anthropological research. Please use with the utmost love and care. <3

@author: Sam Pottinger
@license: MIT License
"""

import datetime
import json
import sys

import bs4
import requests

import common

START_YEAR = 1995

INDEX_PAGE_TEMPLATE = 'http://www.thisamericanlife.org/radio-archives/%d'
EPISODE_PAGE_TEMPLATE = 'http://www.thisamericanlife.org%s'

USAGE_STR = 'USAGE: python tal.py [json location] [all|new]'

DEBUG = True


def enumerate_index_page_locs(start_year=START_YEAR, this_year=None):
    """Enumerate all episode index pages.

    This American Life paginates their listing of epsiodes and this function
    gets the URL for all pages in that pagination series.

    @keyword start_year: The year in which the crawler should start its search.
        Defaults to START_YEAR.
    @type start_year: int
    @keyword this_year: The year in which the crawler should end its search. If
        None, uses the current year. Defaults to None.
    @type this_year: int
    @return: List of URLs where episode listings can be found.
    @rtype: list of str
    """
    if not this_year: this_year = datetime.date.today().year

    return map(
        lambda year: INDEX_PAGE_TEMPLATE % year,
        range(start_year, this_year+1)
    )


def get_index_pages_raw(start_year=START_YEAR, this_year=None):
    """Get the raw contents of episode index pages.

    This American Life paginates their listing of epsiodes and this will
    download the raw content for each of those pages.

    @keyword start_year: The year in which the crawler should start its search.
        Defaults to START_YEAR.
    @type start_year: int
    @keyword this_year: The year in which the crawler should end its search. If
        None, uses the current year. Defaults to None.
    @type this_year: int
    @return: List where each element contains the contents of a single page
        parsed.
    @rtype: list of str
    """
    locs = enumerate_index_page_locs(start_year, this_year)

    returned_requests = map(
        lambda x: requests.get(x, headers=common.DEFAULT_HEADERS),
        locs
    )

    successful_requests = filter(
        lambda x: x.status_code == 200,
        returned_requests
    )

    return map(lambda x: x.text, successful_requests)


def get_episode_locs_from_index(content):
    """Get URLs for individual episodes from an episode index page's contents.

    @param content: The raw text content of a single episode index page.
    @type content: basestring
    @return: List of URLs for pages describing individual episodes.
    @rytpe: list of str
    """
    soup = bs4.BeautifulSoup(content)
    episode_list = soup.find_all(class_='episode-archive')
    headers = map(lambda x: x.find('h3'), episode_list)
    links = map(lambda x: x.find('a'), headers)
    valid_links = filter(lambda x: x != None, links)
    local_urls = map(lambda x: x['href'], valid_links)
    global_urls = map(lambda x: EPISODE_PAGE_TEMPLATE % x, local_urls)

    return global_urls


def interpret_date(content):
    """Interpret a single date string found on the TAL website.

    @param content: The raw string encoding the desired date.
    @type content: basestring
    @return: Date parsed from the provided string.
    @rytpe: datetime.date
    """
    components = content.replace(',', '').split(' ')
    month = common.MONTH_ABBRV[components[0]]
    day = int(components[1])
    year = int(components[2])
    return datetime.date(year, month, day)


def get_episode_info(loc, content):
    """Get information about a single podcast episode.

    @param loc: The URL where infromation about the provided episode can be
        found.
    @type loc: basestring
    @param content: The content of the page at the provided location.
    @type content: basestring
    @return: Dictionary describing the episode. Contains keys name (str value),
        date (datetime.date), loc (url - str value), duration (seconds - int),
        and orig_tags (tags applied to episode - list of str)
    @rtype: dict
    """
    soup = bs4.BeautifulSoup(content)

    episode_title = soup.find(class_='node-title').contents[0]

    date_str = soup.find(class_='top-inner').find(class_='date').contents[0]
    episode_date = interpret_date(date_str)

    tag_sets = soup.findAll(class_ = 'tags')
    tag_set_links = map(lambda x: x.findAll('a'), tag_sets)
    tag_links = [link for links in tag_set_links for link in links]
    tag_names = map(lambda x: x.contents[0].lower(), tag_links)

    return {
        'name': episode_title,
        'date': episode_date,
        'tags': sorted(set(tag_names)),
        'loc': loc
    }


def process_all_episodes():
    """Gather information about all podcast epsiodes.

    @return: List of dictionaries where each dictionary describes a single
        podcast episode.
    @rtype: list of dict
    """
    if DEBUG:
        print 'downloading index pages...'

    index_pages = get_index_pages_raw()
    episode_location_sets = map(
        lambda x: get_episode_locs_from_index(x),
        index_pages
    )
    episode_locations = set(
        [loc for locs in episode_location_sets for loc in locs]
    )

    if DEBUG:
        print 'downloading episodes...'

    episodes_raw = map(
        lambda x: (x, requests.get(x, headers=common.DEFAULT_HEADERS).text),
        episode_locations
    )

    if DEBUG:
        print 'parsing episodes...'

    episode_info = map(
        lambda (loc, text): get_episode_info(loc, text),
        episodes_raw
    )

    return episode_info


def serialize_all_episodes():
    """Gather information about all podcast epsiodes in a serializable form.

    @return: Dictionary with a single episodes key whose value is a list of
        dictionaries where each of those dictionaries describes a single podcast
        episode.
    @rtype: list of dict
    """
    all_episode_info = process_all_episodes()
    return {'episodes': all_episode_info}


def persist_all_episodes(file_location):
    """Gether and save information about all podcast episodes.

    @param file_location: Location to which episode information should be
        persisted in JSON format.
    @type file_location: basestring
    """
    all_episodes = serialize_all_episodes()
    with open(file_location, 'w') as f:
        f.write(
            common.DateJSONEncoder().encode(serialize_all_episodes())
        )


def get_existing_locations_serailized(existing_info):
    """Get the location of each podcast episode described in a collection.

    @param existing_info: The information from which podcast episode location
        should be returned. This should be a dictionary matching the return
        format from serialize_all_episodes.
    @type existing_info: dict
    @return: URLs of podcast episodes described in existing_info.
    @rtype: list of str
    """
    return map(lambda x: x['loc'],  existing_info['episodes'])


def update_episode_serialization(existing_info):
    """Download information about TAL episodes not described in existing_info.

    @param existing_info: Information about podcasts whose metadata already
        exists in the podcast database. This should be a dictionary matching the
        return format from serialize_all_episodes.
    @type existing_info: dict
    @return: Updated existing_info with new episodes added. Dictionary with a
        single episodes key whose value is a list of dictionaries where each of
        those dictionaries describes a single podcast episode.
    @rtype: dict
    """
    index_pages = get_index_pages_raw()
    episode_location_sets = map(
        lambda x: get_episode_locs_from_index(x),
        index_pages
    )

    episode_locations = [loc for locs in episode_location_sets for loc in locs]
    old_locations = get_existing_locations_serailized(existing_info)
    new_locations = set(episode_locations).difference(old_locations)

    new_episodes_raw = map(
        lambda x: (x, requests.get(x, headers=common.DEFAULT_HEADERS).text),
        new_locations
    )

    new_episode_info = map(
        lambda (loc, text): get_episode_info(loc, text),
        new_episodes_raw
    )

    existing_info['episodes'].extend(new_episode_info)

    return existing_info


def update_and_persist_episodes(file_location):
    """Load information about existing episodes and download new information.

    Load information about TAL episodes that hvae already been parsed, find
    and parse episodes not yet included in the database, and finally persist the
    updated collection containing all TAL episode information.

    @param file_location: Location of the JSON file with information about all
        TAL epsiodes previously parsed.
    @type file_location: basestring
    """
    with open(file_location, 'r') as f:
        existing_info = json.load(f)

    updated_info = update_episode_serialization(existing_info)
    with open(file_location, 'w') as f:
        f.write(
            common.DateJSONEncoder().encode(updated_info)
        )


def main():
    """Driver for the TAL parser."""
    if len(sys.argv) != 3:
        print USAGE_STR
        return

    location = sys.argv[1]

    if sys.argv[2] == 'all':
        persist_all_episodes(location)
    elif sys.argv[2] == 'new':
        update_and_persist_episodes(location)
    else:
        print USAGE_STR


if __name__ == '__main__':
    main()
