import datetime
import random
import string

import boto.sdb
import flask

CANDIDATE_QUERY_STR = 'select count(*) from `usage-domain` where user_id="%s"'
CANDIDATE_CHARS = string.digits + string.letters

app = flask.Flask(__name__)
app.debug = True
app.config.from_pyfile('application.cfg', silent=False)

sdb_conn = boto.sdb.connect_to_region(
    'us-east-1',
    aws_access_key_id = app.config['ACCESS_ID'],
    aws_secret_access_key = app.config['ACCESS_KEY']
)


def generate_id():
    candidate_accepted = False
    sdb_domain = sdb_conn.get_domain(app.config['DOMAIN'])
    candidate = None
    while not candidate_accepted:
        candidate = ''.join(random.choice(CANDIDATE_CHARS) for _ in range(10)) 
        query_str = CANDIDATE_QUERY_STR % candidate
        rs = sdb_domain.select(query_str)
        count_info = rs.next()
        candidate_accepted = int(count_info['Count']) == 0

    return candidate


def report_action(user_id, ip_addr, agent, action):
    domain_meta = sdb_conn.domain_metadata(app.config['DOMAIN'])
    overall_count = domain_meta.item_count

    sdb_domain = sdb_conn.get_domain(app.config['DOMAIN'])
    key = str(user_id) + '_' + ip_addr + '_' + str(overall_count)
    item_attrs = {
        'user_id': user_id[:1000],
        'ip_addr': ip_addr[:1000],
        'agent': agent[:1000],
        'action': action[:1000],
        'time': datetime.datetime.now().isoformat()
    }
    sdb_domain.put_attributes(key, item_attrs)


@app.route('/')
def web_tool():
    # Assign an ID if not already provided
    flask.session['user_id'] = flask.session.get('user_id', generate_id())

    # Render homepage
    return flask.render_template(
        'podcast_viz_web.html',
        page='web'
    )


@app.route('/desktop')
def desktop_tool():
    return flask.render_template(
        'desktop.html',
        page='desktop'
    )


@app.route('/about')
def about():
    return flask.render_template(
        'about.html',
        page='about'
    )


@app.route('/contribute')
def contribute():
    return flask.render_template(
        'contribute.html',
        page='contribute'
    )


@app.route('/terms')
def terms():
    return flask.render_template(
        'terms.html',
        page='terms'
    )


@app.route('/usage', methods=['POST'])
def usage():
    user_id = flask.session.get('user_id', generate_id())
    ip_addr = flask.request.remote_addr
    agent = flask.request.headers.get('User-Agent')
    action = flask.request.form['action']
    report_action(user_id, ip_addr, agent, action)
    return 'OK'


if __name__ == '__main__':
    app.run()