"""Unit tests for The Memory Palace parsing logic.

@author: Sam Pottinger
@license: MIT License
"""


import datetime
import unittest

import memory_palace


class MemoryPalaceTests(unittest.TestCase):

    def test_parse_index_page(self):
        with open('memory_palace_index_sample.html', 'r') as f:
            sample_contents = f.read()

        links = memory_palace.parse_index_page(sample_contents)
        self.assertEqual(len(links), 2)
        
        self.assertEqual(
            links[0],
            'http://thememorypalace.us/2009/02/episode-6/'
        )
        self.assertEqual(
            links[1],
            'http://thememorypalace.us/2009/01/episode-5/'
        )

    def test_parse_episode_page(self):
        with open('memory_palace_episode_sample.html', 'r') as f:
            sample_contents = f.read()

        episode_info = memory_palace.parse_episode_page('test', sample_contents)
        self.assertEqual(episode_info['title'], 'Oh My!')
        self.assertEqual(episode_info['date'], datetime.date(2009, 1, 30))
        self.assertEqual(episode_info['loc'], 'test')
        self.assertEqual(episode_info['duration'], 87)
        self.assertEqual(
            episode_info['tags'],
            ['animals', 'dogs', 'manhattan', 'new york', 'parks', 'zoos']
        )


if __name__ == '__main__':
    unittest.main()
