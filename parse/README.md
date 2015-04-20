Podcast Anthrpology Parsers
================================================================================
Set of Python-based programs to download and parse information about episodes from different podcasts.

<br>

Purpose
--------------------------------------------------------------------------------
Downloads information about different podcasts and their episodes, storing the results in JSON files following the form:

```
{
    "episodes": [
        {"loc": "", "name": "H.I. #10: Two Dudes Talking", "tags": ["dudes", "education"],
        ...
    ]
}
```

These programs operate using standard parsing libraries such as Beautiful Soup but also leverage some basic natural language parsing techniques through ntlk. See below for additional details.

<br>

Development Environment Setup
--------------------------------------------------------------------------------
The required Python libraries can easily be installed using pip. For Mac users, consider installing Python via [brew](brew.sh) in order to get pip:

```
brew install python
```

Get the required libraries:

```
pip install ntlk
pip install bs4
pip install requests
```

Note that NLTK also requires a [corpus download as described in their documentation](http://www.nltk.org/data.html).

<br>

Coding standards and guidelines
--------------------------------------------------------------------------------
All Python logic should follow [PEP 0008](https://www.python.org/dev/peps/pep-0008/) with [Epydoc strings](http://epydoc.sourceforge.net) on all modules, classes, and functions / methods. Furthermore, all parsing logic should have 80% or more coverage via automated test.

<br>

A note about podcast love
--------------------------------------------------------------------------------
Note that all of the podcasts listed are external services. We love our podcasters and you should too. this project believes our media including podcasts and radio shows are an important lens into the cultures producing them. This is a tool meant for anthropological research not scraping, aggregation, freebooting, etc. Please use with the utmost love and care. <3

This project gave money to all of the podcasts included (either as Sam Pottinger or as Podcast Anthropology). If you like podcasts, consider throwing them some spare change too. Here are the links:

 - [This American Life](http://www.thisamericanlife.org/)
 - [Radiolab](http://radiolab.org/)
 - [99% Invisible](http://99percentinvisible.org/)
 - [The Memory Palace](http://thememorypalace.us/)
 - [Hello Internet](http://www.hellointernet.fm/)

<br>

Third Party Libraries Used
--------------------------------------------------------------------------------
I <3 Open Source. Here's what the project uses:

 - NLTK Project: [NLTK](http://www.nltk.org) under the [Apache 2.0 License](https://github.com/nltk/nltk/wiki/FAQ).
 - Richardson, Leonard: [Beautiful Soup](http://www.crummy.com/software/BeautifulSoup/) under the [MIT License](http://www.crummy.com/software/BeautifulSoup/).
 