import datetime
import unittest

import bs4

import hello_internet


class HelloInternetTest(unittest.TestCase):

    def setUp(self):
        with open('hello_internet_sample.xml', 'r') as f:
            self.sample_source = f.read()

        self.soup = bs4.BeautifulSoup(self.sample_source)
        self.first_item = self.soup.find('item')

    def test_get_description_content(self):
        description = hello_internet.get_description_content(self.first_item)

        expected_description = 'Warning: Grey and Brady are over-worked, ' +\
        'underprepared, and just a little bit grumpy.  Nonetheless, they ' +\
        'bravely soldier on to discuss: emailing Brady, "You\'re CGP Grey", ' +\
        'the lasting value of (some) teachers, NOT plane crash corner but ' +\
        'iPhone corner!, self-employed vacations, the solar eclipse, and ' +\
        'Vessel.'

        self.assertEqual(expected_description, description)

    def test_get_item_tags(self):
        tags = hello_internet.get_item_tags(self.first_item)

        expected_tags = [
            'brady',
            'cgp grey',
            'iphone corner',
            'plane crash corner',
            'self-employed vacations',
            'some teachers',
            'the lasting value',
            'the solar eclipse',
            'vessel'
        ]

        self.assertEqual(tags, expected_tags)

    def test_parse_item(self):
        new_item = hello_internet.parse_item(self.first_item)
        self.assertEqual(new_item['name'], 'H.I. #34: Line in the Sand')
        self.assertEqual(new_item['date'], datetime.date(2015, 3, 30))
        self.assertEqual(new_item['duration'], 6168)
        self.assertEqual(len(new_item['tags']), 9)
        self.assertEqual(new_item['loc'], '')

    def test_parse_new_items(self):
        new_items = hello_internet.parse_new_items(self.soup, {
            'H.I. #34: Line in the Sand': None
        })

        self.assertEqual(len(new_items), 1)
        new_item = new_items[0]

        self.assertEqual(new_item['name'], 'H.I. #33: Mission to Mars')
        self.assertEqual(new_item['date'], datetime.date(2015, 3, 16))
        self.assertEqual(new_item['duration'], 7200)


if __name__ == '__main__':
    unittest.main()
