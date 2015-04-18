"""Unit tests for the RadioLab website parser.

@author: Sam Pottinger
@license: MIT License
"""

import datetime
import unittest

import radiolab_old


class RadiolabOldTests(unittest.TestCase):

    def test_enumerate_page_locations(self):
        with open('radiolab_old_index_sample.html', 'r') as f:
            sample_src = f.read()

        locations = radiolab_old.enumerate_page_locations(2, sample_src)
        self.assertEqual(len(locations), 10)
        
        for i in range(2, 11):
            self.assertIn(str(i), locations[i - 2])

    def test_read_talk_index_page(self):
        with open('radiolab_old_index_sample.html', 'r') as f:
            sample_src = f.read()

        locations = radiolab_old.read_index_page(sample_src)
        self.assertEqual(len(locations), 2)

        self.assertEqual(
            locations[0],
            'http://www.radiolab.org/story/los-frikis/'
        )
        self.assertEqual(
            locations[1],
            'http://www.radiolab.org/story/fu-go/'
        )

    def test_interpret_date(self):
        interpreted_date = radiolab_old.interpret_date('20150324')
        self.assertEqual(interpreted_date.year, 2015)
        self.assertEqual(interpreted_date.month, 3)
        self.assertEqual(interpreted_date.day, 24)

    def test_read_episode_page(self):
        with open('radiolab_old_episode_sample.html', 'r') as f:
            sample_src = f.read()

        episode_info = radiolab_old.read_episode_page('test', sample_src)

        self.assertEqual(episode_info['name'], 'Los Frikis')
        self.assertEqual(episode_info['date'], datetime.date(2015, 3, 24))
        self.assertEqual(episode_info['loc'], 'test')
        self.assertEqual(episode_info['duration'], radiolab_old.SHORTS_LENGTH)
        self.assertEqual(
            episode_info['tags'],
            [
                'cuba',
                'history',
                'hiv aids',
                'punk rock',
                'shorts',
                'storytelling'
            ]
        )


if __name__ == '__main__':
    unittest.main()
