import collections
import datetime
import unittest

import mox
import requests

import tal


FakeResponse = collections.namedtuple('FakeResponse', ['status_code', 'text'])


class TALTests(mox.MoxTestBase):

    def test_enumerate_index_page_locs(self):
        pages = tal.enumerate_index_page_locs(2013, 2015)
        self.assertEqual(len(pages), 3)
        self.assertEqual(pages[0], tal.INDEX_PAGE_TEMPLATE % 2013)
        self.assertEqual(pages[1], tal.INDEX_PAGE_TEMPLATE % 2014)
        self.assertEqual(pages[2], tal.INDEX_PAGE_TEMPLATE % 2015)

    def test_enumerate_index_page_locs_to_today(self):
        pages = tal.enumerate_index_page_locs(2013, 2015)
        self.assertEqual(pages[0], tal.INDEX_PAGE_TEMPLATE % 2013)

    def test_get_index_pages_raw(self):
        self.mox.StubOutWithMock(tal, 'enumerate_index_page_locs')
        self.mox.StubOutWithMock(requests, 'get')

        tal.enumerate_index_page_locs(2013, 2015).AndReturn(
            ['/2013', '/2014', '/2015']
        )

        requests.get('/2013', headers=tal.DEFAULT_HEADERS).AndReturn(
            FakeResponse(200, 't1')
        )
        requests.get('/2014', headers=tal.DEFAULT_HEADERS).AndReturn(
            FakeResponse(200, 't2')
        )
        requests.get('/2015', headers=tal.DEFAULT_HEADERS).AndReturn(
            FakeResponse(404, 't3')
        )

        self.mox.ReplayAll()

        results = tal.get_index_pages_raw(2013, 2015)
        self.assertEqual(len(results), 2)
        self.assertEqual(results[0], 't1')
        self.assertEqual(results[1], 't2')

    def test_get_episode_locs_from_index(self):
        with open('tal_index_sample.html') as f:
            sample_src = f.read()
        parsed_info = tal.get_episode_locs_from_index(sample_src)

        base_url = 'http://www.thisamericanlife.org/radio-archives/episode/'
        self.assertEqual(len(parsed_info), 2)
        self.assertEqual(parsed_info[0], base_url + '554/not-it')
        self.assertEqual(
            parsed_info[1],
            base_url + '553/stuck-in-the-middle-2015'
        )

    def test_interpret_date(self):
        interpreted_date = tal.interpret_date('Mar 12, 2015')
        self.assertEqual(interpreted_date.year, 2015)
        self.assertEqual(interpreted_date.month, 3)
        self.assertEqual(interpreted_date.day, 12)

    def test_get_episode_info(self):
        with open('tal_talk_sample.html') as f:
            sample_src = f.read()
        parsed_info = tal.get_episode_info('test', sample_src)

        self.assertEqual(
            parsed_info['date'],
            datetime.date(2015, 3, 20)
        )

        self.assertEqual(parsed_info['name'], '551: Good Guys 2015')

        self.assertEqual(
            parsed_info['tags'],
            [
                'business',
                'city',
                'death',
                'funny',
                'heroism',
                'live performance',
                'mental health'
            ]
        )

        self.assertEqual(parsed_info['loc'], 'test')


if __name__ == '__main__':
    unittest.main()
