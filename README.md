Podcast Anthropology
================================================================================
Visualization and natural language processing project for understanding the "nature of podcasts" and seeing their human listeners through topic analysis.

**Note that this project is now effectively in archive.**

<br>

Purpose
--------------------------------------------------------------------------------
Podcasts are typically periodic audio-only Internet 'radio shows' that, like any media, act as a lens into the cultures producing and consuming them. Once niche, around 25% of Internet users listen to podcasts according to the Pew Research Center. Although, being online they also reach an international community and some also play on typical radio stations.

What is the nature of these podcasts? Can they say anything about their audiences? Can they let us see into emerging cultural trends? This project tries to take a first stab at answering those questions through a mixture of natural language processing and data visualization.

<br>

Project Components
--------------------------------------------------------------------------------
This project is made up of a pipeline of data parsing, processing, and visualization. Each piece is contained within a directory inside of this repository. Each component has its own README with more specific documentation.

 - **parse**: Python scripts to download and process podcast episode information including some natural language processing.
 - **combine**: Python scripts to combine the results of logic for individual podcasts into a single dataset suitable for processing and visualization.
 - **podcast_viz_local**: Prototype of the podcast anthropology visualization. This desktop tool written in Processing has been superceeded by its p5js equivalent.
 - **podcast_viz_web**: Podcast anthropology visualization written in p5js that represents the "end product" of this project.

<br>

Local Development Environment Setup
--------------------------------------------------------------------------------
Each component of the pipeline has different local development environment setup instructions:

 - The parsing scripts require some python modules which can be installed via pip. See the parse directory for additional details.
 - The combine scripts use the Python standard library and only require the standard Python 2.7 distribution.
 - The local podcast visualization (podcast_viz_local) only requires the standard [Processing distribution](https://processing.org/download/). It can run under both the 2.x and 3.x series.
 - The web-based podcast visualization requires both JS and Python libraries. See the podcast_viz_web directory for additional details.

<br>

Automated testing
--------------------------------------------------------------------------------
Podcast parsing has automated unit testing available using the standard Python unit testing module. At present, unfortunately this was a personal project done in-between jobs on vacation and no other pipeline components are under code-coverage. See the parse directory for additional details.

<br>

Coding standards and guidelines
--------------------------------------------------------------------------------
All Python logic should follow [PEP 0008](https://www.python.org/dev/peps/pep-0008/) with [Epydoc strings](http://epydoc.sourceforge.net) on all modules, classes, and functions / methods. Furthermore, all parsing logic should have 80% or more coverage via automated test.

All Javascript should include [JSDoc strings](https://github.com/jsdoc3/jsdoc) and should follow [Google JS guidelines](https://google.github.io/styleguide/javascriptguide.xml) except that [Singleton Object Classes](http://www.phpied.com/3-ways-to-define-a-javascript-class/) are allowed.

<br>

License
--------------------------------------------------------------------------------
All code under [MIT License](http://opensource.org/licenses/MIT). 

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

 - Colebourne, Stephen: [Joda-Time](http://www.joda.org/joda-time/) under the [Apache 2.0 License](http://www.joda.org/joda-time/license.html).
 - Denicola, Domenic: [Domenic/dict](https://github.com/domenic/dict) under the [DWTFYW Public License](https://github.com/domenic/dict/blob/master/LICENSE.txt).
 - JQuery Foundation: [JQuery](http://jquery.com) under the [MIT License](https://jquery.org/license/).
 - NLTK Project: [NLTK](http://www.nltk.org) under the [Apache 2.0 License](https://github.com/nltk/nltk/wiki/FAQ).
 - Processing Foundation: [p5js](http://p5js.org) under the [GNU LGPL v2 License](https://github.com/processing/p5.js/blob/master/license.txt).
 - Processing Foundation: [Processing core](https://processing.org) under the [GNU LGPL v2 License](https://github.com/processing/processing/wiki/FAQ).
 - Rich, Micah, Caroline Hadilaksono, and Tyler Finck: [League Spartan](https://www.theleagueofmoveabletype.com/league-spartan) under the [Open Font License](http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL).
 - Richardson, Leonard: [Beautiful Soup](http://www.crummy.com/software/BeautifulSoup/) under the [MIT License](http://www.crummy.com/software/BeautifulSoup/).
 - Ronacher, Armin: [Flask](http://flask.pocoo.org) under the [BSD License](http://flask.pocoo.org/docs/0.10/license/).
 - Schwartz, Barry: [Fanwood](https://www.theleagueofmoveabletype.com/fanwood) under the [Open Font License](http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL)
 - Vepsäläinen, Juho: [Bebraw/setjs](https://github.com/bebraw/setjs) under the [MIT License](https://github.com/bebraw/setjs/blob/master/LICENSE).
 - Wood, Tim, and Iskren Cherne: [Moment.js](http://momentjs.com) under the [MIT License](https://github.com/moment/moment/blob/develop/LICENSE).

<br>

Works Cited / Sources
--------------------------------------------------------------------------------
 - Colebourne, Stephen. "Joda-Time." Joda.org. Joda Project, n.d. Web. 15 Apr. 2015.
 - Denicola, Domenic. "Domenic/dict." Github. N.p., n.d. Web. 15 Apr. 2015.
 - DiMeo, Nate. "Episodes." The Memory Palace. Nate DiMeo, n.d. Web. 15 Apr. 2015.
 - Glass, Ira. "Radio Archive by Date." This American Life. Chicago Public Media, n.d. Web. 15 Apr. 2015.
 - Grey, CGP, and Brady Haran. "Hello Internet." Hello Internet RSS Feed. N.p., n.d. Web. 15 Apr. 2015.
 - Harris, Jonathan. "We Feel Fine." Number 27. N.p., 2006. Web. 15 Apr. 2015.
 - "JQuery." JQuery. JQuery Foundation, n.d. Web. 15 Apr. 2015.
 - Kamvar, Sep, Sep Kamvar, and Jonathan Jennings Harris. We Feel Fine: An Almanac of Human Emotion. New York: Scribner, 2009. Print.
 - Mars, Roman. "Episode." 99% Invisible. PRX, n.d. Web. 15 Apr. 2015.
 - Munzner, Tamara. "15 Views of a Node Link Graph." YouTube. Google Inc, 22 Aug. 2012. Web. 15 Apr. 2015.
 - "NLTK 3.0 Documentation." Natural Language Toolkit. NLTK Project, n.d. Web. 15 Apr. 2015.
 - "P5.js." P5.js. Processing Foundation, n.d. Web. 15 Apr. 2015.
 - "Podcasts." Radiolab. WYNC, n.d. Web. 15 Apr. 2015.
 - "Processing.org." Procesing.org. Processing Foundation, n.d. Web. 15 Apr. 2015.
 - "Radiolab Archive." Radiolab. WNYC, n.d. Web. 15 Apr. 2015.
 - Rees, Kim. "Living, Breathing Data." YouTube. Bocoup LLC, 5 June 2013. Web. 15 Apr. 2015.
 - Rich, Micah, Caroline Hadilaksono, and Tyler Finck. "League Spartan." The League of Moveable Type. A Good Company, n.d. Web. 15 Apr. 2015.
 - Richardson, Leonard. "Beautiful Soup." Beautiful Soup. N.p., n.d. Web. 15 Apr. 2015.
 - Sanchez, Gaston. "Star Wars Arc Diagram." N.p., 3 Feb. 2013. Web. 15 Apr. 2015.
 - Schwartz, Barry. "Fanwood." The League of Moveable Type. A Good Company, n.d. Web. 15 Apr. 2015.
 - Shiffman, Daniel, Shannon Fry, and Zannah Marsh. The Nature of Code. New York: Interactive Telecommunications Program at New York U, 2012. Print.
 - Stefaner, Moritz. "Elastic Lists." Http://archive.stefaner.eu. N.p., n.d. Web. 15 Apr. 2015.
 - Vepsäläinen, Juho. "Bebraw/setjs." GitHub. N.p., n.d. Web. 15 Apr. 2015.
 - Victor, Bret. "Media for Thinking the Unthinkable." Vimeo. MIT Media Lab, 4 Apr. 2013. Web. 15 Apr. 2015.
 - Wood, Tim, and Iskren Cherne. "Moment.js." Moment.js. N.p., n.d. Web. 15 Apr. 2015.
 - Zickuhr, Kathryn. "Over a Quarter of Internet Users Download or Listen to Podcasts." Fact Tank. Pew Research Center, 27 Dec. 2013. Web. 15 Apr. 2015.
 
<br>

Ongoing work
------------------------------------------------------------------------------------------------------------------------
I love this project dearly but, unfortunately, I wrote this while between jobs and my new gig precludes my continued involvement. I uploaded lingering changes to help future work but alas I have written my last for now. If you are interested in picking up the baton, shoot me a note or fork. :)
