import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';
import _ from 'lodash';
import readingTime from 'reading-time';
import { Checkbox, Form, Input, Select, Button, Collapse } from 'antd';
import { rewardsValues } from '../../../common/constants/rewards';
import Action from '../Button/Action';
import requiresLogin from '../../auth/requiresLogin';
import withEditor from './withEditor';
import EditorInput from './EditorInput';
import FarmrDropdown from './FarmrDropdown';
import { remarkable } from '../Story/Body';
import BodyContainer from '../../containers/Story/BodyContainer';
import './Editor.less';

@injectIntl
@requiresLogin
@Form.create()
@withEditor
class Editor extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    title: PropTypes.string,
    topics: PropTypes.arrayOf(PropTypes.string),
    body: PropTypes.string,
    reward: PropTypes.string,
    upvote: PropTypes.bool,
    loading: PropTypes.bool,
    isUpdating: PropTypes.bool,
    saving: PropTypes.bool,
    draftId: PropTypes.string,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    onSubmit: PropTypes.func,
    onError: PropTypes.func,
    onImageUpload: PropTypes.func,
    onImageInvalid: PropTypes.func,
  };

  static defaultProps = {
    title: '',
    topics: [],
    body: '',
    reward: rewardsValues.half,
    upvote: true,
    recentTopics: [],
    popularTopics: [],
    loading: false,
    isUpdating: false,
    saving: false,
    draftId: null,
    onUpdate: () => {},
    onDelete: () => {},
    onSubmit: () => {},
    onError: () => {},
    onImageUpload: () => {},
    onImageInvalid: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      body: '',
      bodyHTML: '',
    };

    this.onUpdate = this.onUpdate.bind(this);
    this.onHashtagUpdate = this.onHashtagUpdate.bind(this)
    this.setValues = this.setValues.bind(this);
    this.setBodyAndRender = this.setBodyAndRender.bind(this);
    this.throttledUpdate = this.throttledUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setValues(this.props);

    // eslint-disable-next-line react/no-find-dom-node
    const select = ReactDOM.findDOMNode(this.select);
    if (select) {
      const selectInput = select.querySelector('input,textarea,div[contentEditable]');
      if (selectInput) {
        selectInput.setAttribute('autocorrect', 'off');
        selectInput.setAttribute('autocapitalize', 'none');
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { title, topics, body, reward, upvote, draftId } = this.props;
    if (
      title !== nextProps.title ||
      !_.isEqual(topics, nextProps.topics) ||
      body !== nextProps.body ||
      reward !== nextProps.reward ||
      upvote !== nextProps.upvote ||
      (draftId && nextProps.draftId === null)
    ) {
      this.setValues(nextProps);
    }
  }

  onUpdate() {
    _.throttle(this.throttledUpdate, 200, { leading: false, trailing: true })();
  }

  onHashtagUpdate(value) {
    console.log(value);
    if (value === 'ulog' || value === 'surpassinggoogle') {
      this.props.form.setFieldsValue({
        title: 'FARMR: ',
        topics: ['ulog', 'surpassinggoogle'],
      });
    } else if (value === 'teardrops') {
      this.props.form.setFieldsValue({
        title: 'TEARDROPS: ',
        topics: ['ulog', 'teardrops'],
      });
    } else if (value === 'untalented') {
      this.props.form.setFieldsValue({
        title: 'UNTALENTED: ',
        topics: ['ulog', 'untalented'],
      });
    } else if (value === 'philippines') {
      this.props.form.setFieldsValue({
        topics: ['ulog', 'philippines'],
      });
    }
  }

  setValues(post) {
    // NOTE: Used to rollback damaged drafts - https://github.com/busyorg/busy/issues/1412
    // Might be deleted after a while.
    let reward = rewardsValues.half;
    if (
      post.reward === rewardsValues.all ||
      post.reward === rewardsValues.half ||
      post.reward === rewardsValues.none
    ) {
      reward = post.reward;
    }

    this.props.form.setFieldsValue({
      title: post.title,
      topics: post.topics,
      body: post.body,
      reward,
      upvote: post.upvote,
    });

    this.setBodyAndRender(post.body);
  }

  setBodyAndRender(body) {
    this.setState({
      body,
      bodyHTML: remarkable.render(body),
    });
  }

  checkTopics = intl => (rule, value, callback) => {
    if (!value || value.length < 1 || value.length > 5) {
      callback(
        intl.formatMessage({
          id: 'topics_error_count',
          defaultMessage: 'Please add 1 to 5 topics.',
        }),
      );
    }

    value
      .map(topic => ({ topic, valid: /^[a-z0-9]+(-[a-z0-9]+)*$/.test(topic) }))
      .filter(topic => !topic.valid)
      .map(topic =>
        callback(
          intl.formatMessage(
            {
              id: 'topics_error_invalid_topic',
              defaultMessage: 'Topic {topic} is invalid.',
            },
            {
              topic: topic.topic,
            },
          ),
        ),
      );

    callback();
  };

  throttledUpdate() {
    const { form } = this.props;

    const values = form.getFieldsValue();
    this.setBodyAndRender(values.body);

    if (Object.values(form.getFieldsError()).filter(e => e).length > 0) return;

    this.props.onUpdate(values);
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) this.props.onError();
      else this.props.onSubmit(values);
    });
  }

  handleDelete(e) {
    e.stopPropagation();
    e.preventDefault();
    this.props.onDelete();
  }

  render() {
    const { intl, form, loading, isUpdating, saving, draftId } = this.props;
    const { getFieldDecorator } = form;
    const { body, bodyHTML } = this.state;
    const { words, minutes } = readingTime(bodyHTML);
    const Panel = Collapse.Panel;

    return (
      <div>
        <div>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="The General-Purpose Editor" key="1">
              <p>
                <b>Farmr.club has a bunch of specialized editors for posting Farmr,</b> whether you are farming under <a href="https://farmr.club/created/ulog">#farmr</a> or under a #farmr-subtag (e.g <a href="https://farmr.club/created/ulography">#farmrraphy</a>, <a href="https://farmr.club/created/ulog-resolutions">#farmr-resolutions</a>, <a href="https://farmr.club/created/ulog-hugot">#farmr-hugot</a> etc.). You can explore these editors by clicking the <b>"PEN Icon"</b> on the top right area across our website. <br/>
                Alternatively though, <b><i>if you have found yourself here</i></b>, you can always use this <b>"General-Purpose Editor"</b> to post your <b>Farmr, normal blogs etc</b>, after following a few guidelines. <b>Make sure to expand (read) the Style-Guide just below</b>, before you post, to be sure you are posting correctly. <br/><br/>
                <b>The general principle</b> when posting under <a href="https://farmr.club/created/ulog">#farmr</a> or under any #farmr-subtag is; <b><i>[the more popular "<a href="https://farmr.club/created/ulog">#farmr</a>" should be your first hashtag, while the "#farmr-subtag" should be the 2nd hashtag]</i></b>. <br/><br/>
                Note that, <b>you are allowed to birth fresh ulog-subtags along with the "communities" these bring!</b> Inanycase, <b>(for Farmr)</b> always maintain "<a href="https://farmr.club/created/ulog">#farmr</a>" as your first hashtag, <b>whenever your post is Farmr-related.</b> <br/>
                <b>Special Note:</b> You can also post on steemit like normal <b>e.g blogs etc</b>, using the <b>"General-Purpose" editor below.</b> In this case, <b>you have no need to use <a href="https://farmr.club/created/ulog">#farmr</a></b>. Simply chose 5 hashtags related to your subject and chose a Catch Title. <br/><br/>
                <span style={{color: 'purple'}}><b><i>Kindly expand the Style-Guide below for QUICK INSIGHT!!!</i></b></span>
              </p>
            </Panel>
          </Collapse>
        </div>
        <div className="hashtags">
          <FarmrDropdown />
        </div>
        <div>
          <Collapse>
            <Panel header="The General-Purpose Editor (Style-Guide For #farmr/#farmr-subtags)" key="1">
            <u><b>Farmr-KnowledgeBank:</b></u>
            <div style={{ color : 'purple' }}>
              <ul style={{ 'listStyleType' : 'circle', marginLeft : '20px' }}>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulography">#farmrraphy</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulography">#farmrraphy</a> etc] <b>IN-TITLE:</b> [add "(FARMR + Photography):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-gratefulvibes">#farmr-gratefulvibes</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-gratefulvibes">#farmr-gratefulvibes</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + GratefulVibes):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-resolutions">#farmr-resolutions</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-resolutions">#farmr-resolutions</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + Resolutions):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-memes">#farmr-memes</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-memes">#farmr-memes</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + Memes):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-blocktrades">#farmr-blocktrades</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-blocktrades">#farmr-blocktrades</a> etc] <b>IN-TITLE:</b> [add "(FARMR + Blocktrades):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-podcasts">#farmr-podcasts</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-podcasts">#farmr-podcasts</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + Podcasts):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-showerthoughts">#farmr-showerthoughts</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-showerthoughts">#farmr-showerthoughts</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + ShowerThoughts):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-snookmademedoit">#farmr-snookmademedoit</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-snookmademedoit">#farmr-snookmademedoit</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + SnookMadeMeDoIt):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-terrysays">#farmr-terrysays</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-terrysays">#farmr-terrysays</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + TerrySays):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-recipes">#farmr-recipes</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-recipes">#farmr-recipes</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + Recipes):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-hugot">#farmr-hugot</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-hugot">#farmr-hugot</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + Hugot):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-steem">#farmr-steem</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-steem">#farmr-steem</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + Steem):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-steemit">#farmr-steemit</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-steemit">#farmr-steemit</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + Steemit):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-cryptocurrency">#farmr-cryptocurrency</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-cryptocurrency">#farmr-cryptocurrency</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + Cryptocurrency):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-poetry">#farmr-poetry</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-poetry">#farmr-poetry</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + Poetry):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-steemstem">#farmr-steemstem</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-steemstem">#farmr-steemstem</a>, <a href="https://farmr.club/created/steemstem">#steemstem</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + SteemStem):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-utopian">#farmr-utopian</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-utopian">#farmr-utopian</a>, <a href="https://farmr.club/created/utopian-io">#utopian-io</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + Utopian.io):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-macrohard">#farmr-macrohard</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-macrohard">#farmr-macrohard</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + MacroHard):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulogifs">#farmrifs</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulogifs">#farmrifs</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + GIFs):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-exchange">#farmr-exchange</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-exchange">#farmr-exchange</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + Exchange):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-wiki">#farmr-wiki</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-wiki">#farmr-wiki</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + Wiki):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-freebies">#farmr-freebies</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-freebies">#farmr-freebies</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + Freebies):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-curated">#farmr-curated</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-curated">#farmr-curated</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + Curated):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-pets">#farmr-pets</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-pets">#farmr-pets</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + Pets):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-books">#farmr-books</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-books">#farmr-books</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + Books):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-funny">#farmr-funny</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-funny">#farmr-funny</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + Funny):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-savetheday">#farmr-savetheday</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-savetheday">#farmr-savetheday</a> etc] <b>IN-TITLE:</b> [add "(FARMR + SaveTheDay):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-zoo">#farmr-zoo</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-zoo">#farmr-zoo</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + Zoo):" etc.]</font></li>
                <li><font size="2"><b>etc</b></font></li>
              </ul>
            </div>
            <u><b>Farmr-FanLove (BeLikeTerry):</b></u>
            <div style={{ color : 'purple' }}>
              <ul style={{ 'listStyleType' : 'circle', marginLeft : '20px' }}>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-curie">#farmr-curie</a>:</b> <b>TAGS-Order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-curie">#farmr-curie</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + Curie):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-ocd">#farmr-ocd</a>:</b> <b>TAGS-order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-ocd">#farmr-ocd</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + OCD):" etc.]</font></li>
                <li><font size="2"><b>Farming_<a href="https://farmr.club/created/ulog-thejohalfiles">#farmr-thejohalfiles</a>?</b> <b>TAGS-order:</b> [<a href="https://farmr.club/created/ulog">#farmr</a>, <a href="https://farmr.club/created/ulog-thejohalfiles">#farmr-thejohalfiles</a> etc.] <b>IN-TITLE:</b> [add "(FARMR + TheJohalFiles):" etc.]</font></li>

              </ul>
            </div>
            </Panel>
          </Collapse>

        </div>
      <Form className="Editor" layout="vertical" onSubmit={this.handleSubmit}>
        <Helmet>
          <title>
            {intl.formatMessage({ id: 'write_post', defaultMessage: 'Write post' })} - Farmr
          </title>
        </Helmet>
        <Form.Item
          label={
            <span className="Editor__label">
              <FormattedMessage id="title" defaultMessage="Title" />
            </span>
          }
        >
          {getFieldDecorator('title', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'title_error_empty',
                  defaultMessage: 'title_error_empty',
                }),
              },
              {
                max: 255,
                message: intl.formatMessage({
                  id: 'title_error_too_long',
                  defaultMessage: "Title can't be longer than 255 characters.",
                }),
              },
            ],
          })(
            <Input
              ref={title => {
                this.title = title;
              }}
              onChange={this.onUpdate}
              className="Editor__title"
              placeholder={intl.formatMessage({
                id: 'title_placeholder',
                defaultMessage: 'Add title',
              })}
            />,
          )}
        </Form.Item>
        <Form.Item
          label={
            <span className="Editor__label">
              <FormattedMessage id="topics" defaultMessage="Topics" />
            </span>
          }
        >
          {getFieldDecorator('topics', {
            initialValue: [],
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'topics_error_empty',
                  defaultMessage: 'Please enter topics',
                }),
                type: 'array',
              },
              { validator: this.checkTopics(intl) },
            ],
          })(
            <Select
              ref={ref => {
                this.select = ref;
              }}
              onChange={this.onUpdate}
              className="Editor__topics"
              mode="tags"
              placeholder={intl.formatMessage({
                id: 'topics_placeholder',
                defaultMessage: 'Add hashtags here',
              })}
              dropdownStyle={{ display: 'none' }}
              tokenSeparators={[' ', ',']}
            />,
          )}
        </Form.Item>
        <div className="Editor__hashtags">
          <p>
            Choose 1 to 5 hashtags closely related to your content. These will make your post searchable by readers, rank them better in the search engines and expose your posts to better curation, accruing you a "true-fanbase". <br/>
            Want to "mine the human" some more? Try one of our #farming editors from the drop-down just above. <br/>
          </p>
        </div>

        <Form.Item>
          {getFieldDecorator('body', {
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'story_error_empty',
                  defaultMessage: "Story content can't be empty.",
                }),
              },
            ],
          })(
            <EditorInput
              rows={12}
              addon={
                <FormattedMessage
                  id="reading_time"
                  defaultMessage={'{words} words / {min} min read'}
                  values={{
                    words,
                    min: Math.ceil(minutes),
                  }}
                />
              }
              onChange={this.onUpdate}
              onImageUpload={this.props.onImageUpload}
              onImageInvalid={this.props.onImageInvalid}
              inputId={'editor-inputfile'}
            />,
          )}
        </Form.Item>
        {body && (
          <Form.Item
            label={
              <span className="Editor__label">
                <FormattedMessage id="preview" defaultMessage="Preview" />
              </span>
            }
          >
            <BodyContainer full body={body} />
          </Form.Item>
        )}
        <Form.Item
          className={classNames({ Editor__hidden: isUpdating })}
          label={
            <span className="Editor__label">
              <FormattedMessage id="reward" defaultMessage="Reward" />
            </span>
          }
        >
          {getFieldDecorator('reward')(
            <Select onChange={this.onUpdate} disabled={isUpdating}>
              <Select.Option value={rewardsValues.all}>
                <FormattedMessage id="reward_option_100" defaultMessage="100% Steem Power" />
              </Select.Option>
              <Select.Option value={rewardsValues.half}>
                <FormattedMessage id="reward_option_50" defaultMessage="50% SBD and 50% SP" />
              </Select.Option>
              <Select.Option value={rewardsValues.none}>
                <FormattedMessage id="reward_option_0" defaultMessage="Declined" />
              </Select.Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item className={classNames({ Editor__hidden: isUpdating })}>
          {getFieldDecorator('upvote', { valuePropName: 'checked', initialValue: true })(
            <Checkbox onChange={this.onUpdate} disabled={isUpdating}>
              <FormattedMessage id="like_post" defaultMessage="Like this post" />
            </Checkbox>,
            <Checkbox onChange={this.onUpdate} disabled={isUpdating}>
              <FormattedMessage id="like_post" defaultMessage="Like this post" />
            </Checkbox>,
        )}
        </Form.Item>
        <div className="Editor__bottom">
          <span className="Editor__bottom__info">
            <i className="iconfont icon-markdown" />{' '}
            <FormattedMessage
              id="markdown_supported"
              defaultMessage="Styling with markdown supported"
            />
          </span>
          <div className="Editor__bottom__right">
            {saving && (
              <span className="Editor__bottom__right__saving">
                <FormattedMessage id="saving" defaultMessage="Saving..." />
              </span>
            )}
            <Form.Item className="Editor__bottom__cancel">
              {draftId && (
                <Button type="danger" size="large" disabled={loading} onClick={this.handleDelete}>
                  <FormattedMessage id="draft_delete" defaultMessage="Delete this draft" />
                </Button>
              )}
            </Form.Item>
            <Form.Item className="Editor__bottom__submit">
              {isUpdating ? (
                <Action primary big loading={loading} disabled={loading}>
                  <FormattedMessage
                    id={loading ? 'post_send_progress' : 'post_update_send'}
                    defaultMessage={loading ? 'Submitting' : 'Update post'}
                  />
                </Action>
              ) : (
                <Action primary big loading={loading} disabled={loading}>
                  <FormattedMessage
                    id={loading ? 'post_send_progress' : 'post_send'}
                    defaultMessage={loading ? 'Submitting' : 'Post'}
                  />
                </Action>
              )}
            </Form.Item>
          </div>
        </div>
      </Form>
      </div>
    );
  }
}

export default Editor;
