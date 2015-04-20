Web Podcast Visualization
================================================================================
Web-based visualization for the Podcast Anthropology project.

<br>

Purpose
--------------------------------------------------------------------------------
This web-based visualization allows the user to see which podcast published which episodes, how frequently and when each podcast released new shows, the duration of each show of each podcast, and the topics discussed in each podcast.

<br>

Local Development Environment Setup
--------------------------------------------------------------------------------
This component requires both Python and JS. The JS dependencies are bundled (see below for license). The Python web server requires Python 2.7 or higher 2.x and Flask.

These dependencies can be satsified on a Mac with [homebrew](http://brew.sh):

```
$ brew install Python
$ pip install flask
```

All of the JS behind the visualization lives under ```static/js```.

<br>

Coding standards and guidelines
--------------------------------------------------------------------------------
All Python logic should follow [PEP 0008](https://www.python.org/dev/peps/pep-0008/) with [Epydoc strings](http://epydoc.sourceforge.net) on all modules, classes, and functions / methods. All Javascript should include [JSDoc strings](https://github.com/jsdoc3/jsdoc) and should follow [Google JS guidelines](https://google.github.io/styleguide/javascriptguide.xml) except that [Singleton Object Classes](http://www.phpied.com/3-ways-to-define-a-javascript-class/) are allowed.

<br>

License
--------------------------------------------------------------------------------
All code under [MIT License](http://opensource.org/licenses/MIT). 

<br>

Third Party Libraries Used
--------------------------------------------------------------------------------
I <3 Open Source. For additional details see root README. Here's what the project uses:

 - Denicola, Domenic: [Domenic/dict](https://github.com/domenic/dict) under the [DWTFYW Public License](https://github.com/domenic/dict/blob/master/LICENSE.txt).
 - JQuery Foundation: [JQuery](http://jquery.com) under the [MIT License](https://jquery.org/license/).
 - Processing Foundation: [p5js](http://p5js.org) under the [GNU LGPL v2 License](https://github.com/processing/p5.js/blob/master/license.txt).
 - Rich, Micah, Caroline Hadilaksono, and Tyler Finck: [League Spartan](https://www.theleagueofmoveabletype.com/league-spartan) under the [Open Font License](http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL).
 - Ronacher, Armin: [Flask](http://flask.pocoo.org) under the [BSD License](http://flask.pocoo.org/docs/0.10/license/).
 - Schwartz, Barry: [Fanwood](https://www.theleagueofmoveabletype.com/fanwood) under the [Open Font License](http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL)
 - Vepsäläinen, Juho: [Bebraw/setjs](https://github.com/bebraw/setjs) under the [MIT License](https://github.com/bebraw/setjs/blob/master/LICENSE).
 - Wood, Tim, and Iskren Cherne: [Moment.js](http://momentjs.com) under the [MIT License](https://github.com/moment/moment/blob/develop/LICENSE).
