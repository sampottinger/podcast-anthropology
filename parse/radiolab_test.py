import radiolab

import datetime
import unittest


class RadiolabTests(unittest.TestCase):

    def test_interpret_pub_date(self):
        pub_date = radiolab.interpret_pub_date(
            'Tue, 24 Mar 2015 15:34:05 -0400'
        )
        self.assertEqual(pub_date.year, 2015)
        self.assertEqual(pub_date.month, 3)
        self.assertEqual(pub_date.day, 24)

    def test_interpret_duration(self):
        duration_sec = radiolab.interpret_duration('1:30:15')
        self.assertEqual(duration_sec, 5415)

    def test_process_rss_content(self):
        with open('radiolab_sample.xml') as f:
            test_source = f.read()

        parsed_items = radiolab.serialize_rss_content(test_source)['episodes']
        self.assertEqual(len(parsed_items), 2)
        
        self.assertEqual(parsed_items[0]['name'], 'Los Frikis')
        self.assertEqual(parsed_items[0]['date'], datetime.date(2015, 3, 24))
        self.assertEqual(parsed_items[0]['duration'], 1897)
        self.assertEqual(
            parsed_items[0]['tags'],
            ['cuba', 'history', 'hiv_aids', 'punk_rock', 'storytelling']
        )

        self.assertEqual(parsed_items[1]['name'], 'Fu-Go')
        self.assertEqual(parsed_items[1]['date'], datetime.date(2015, 3, 10))
        self.assertEqual(parsed_items[1]['duration'], 2138)
        self.assertEqual(
            parsed_items[1]['tags'],
            [
                '1939-1945 [lc]',
                'balloons',
                'history',
                'storytelling',
                'world war'
            ]
        )


if __name__ == '__main__':
    unittest.main()
