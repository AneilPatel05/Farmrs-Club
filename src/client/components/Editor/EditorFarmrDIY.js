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
class EditorFarmrDIY extends React.Component {
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
    handleExtraMonetization: PropTypes.func,
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
    handleExtraMonetization: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      body: '',
      bodyHTML: '',
    };

    this.onUpdate = this.onUpdate.bind(this);
    this.setValues = this.setValues.bind(this);
    this.setBodyAndRender = this.setBodyAndRender.bind(this);
    this.throttledUpdate = this.throttledUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setValues(this.props);
    this.props.form.setFieldsValue({
      title: 'FARMR (DIY): ',
      topics: ['ulog', 'ulog-diy'],
    });

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
    if (value[0] !== 'ulog') {
      callback(
        intl.formatMessage({
          id: 'ulog_not_topic',
          defaultMessage: '#farmr must be the first tag for posts.',
        })
      )
    }

    if (!value || value.length < 1 || value.length > 5) {
      callback(
        intl.formatMessage({
          id: 'topics_error_count',
          defaultMessage: 'You must add 1 to 4 topics with #farmr as the first.',
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
            <Panel header='The "#farmr-diy" Editor' key="1">
              <p>
              We like to reward #farming contributions born solely out of <span className="bold-italic">"your experience" (per day)</span>. We seek to incentivize you to learn something new <span className="bold-italic">(per day)</span>, for the sake of #farming. This way, <span className="bold-italic">"not a day slips emptily by" and not a day aren't you capable of reshaping the INTERNET; touching your "true fans" and attaining "true celebrity-hood" etc</span>
              <br/> It's simple. When you add #farmr to any existing concept etc an existing concept suddenly turns out all fresh. Simply use this editor to contribute to the Farmr-KnowledgeBank, <span className="bold-italic">freshly-made #farmr-DIY(s) born solely out of your experience (per day)</span>. <br/>

              Become "true fans"! Visit #farmr-diy daily. Join its community on <span className="bold-italic" style={{'color':'blue'}}>Discord</span> & <span className="bold-italic" style={{'color':'blue'}}>Telegram</span>.

              </p>
            </Panel>
          </Collapse>
        </div>
        <div className="hashtags">
          <FarmrDropdown />
        </div>
        <div>
          <Collapse>
            <Panel header='When/How/Why use the "#farmr-diy" editor?/?/?' key="1">
              Did you gather some DIY knowledge on a specific skill, craft or expertise today? Are you gathering DIY knowledge as we speak? Do you plan on doing some exciting DIY today, by yourself or with friends etc for the sole reason of contributing a #farmr-DIY post?
              <br/>
              <blockquote style={{'border-left':'3px solid #a9a9a9', 'padding' : '0 10px', 'color' : '#a9a9a9'}}>Why not create a post about it right now! Don't let this knowledge stay redundant. The world and your entire audience of "true fans" needs to hear it!</blockquote>
            </Panel>
          </Collapse>
          <Collapse>
            <Panel header="Tips To Prowess" key="1">
              <ul style={{ 'listStyleType' : 'circle', marginLeft : '20px' }}>
                <li>Be yourself and as expressive as possible. <span className="bold-italic">The world and generations yet unborn will come here to dig from your ulog-experience</span>.</li>
                <li>In the art of #farming on #farmr-diy, there is no need to resource from the internet. <span className="bold-italic">Keep all videos, images, sound, avatars fresh. Let's gift to internet and re-shape it, with "YOU"!</span></li>
                <li>Relegate reservations, attempt out-of-the-boxness; <span className="bold-italic">"flaws allowed"!</span></li>
                <li>Every #farmr-diy post that you write here appears on the decentralized steem blockchain and can earn you a variety of rewards, steem, opportunities etc. <span className="bold-italic">Make the most of each post</span>.</li>
                <li>Remember that you have <span className="bold-italic">"you"</span> as your first audience, an <span className="bold-italic">audience of "true fans"</span>, an <span className="bold-italic">audience in the search engines and an audience of generations yet unborn</span>. Use each #farmr-diy post <span className="bold-italic">to leave your #farmracies in lights</span>.</li>
                <li><span className="bold-italic">Be "true fans" on #farmr-diy, get inspired, grow your "true fan-base"</span>.</li>
                <li>Grow each time!</li>
                <li><span className="bold-italic">Join the #farmr-diy community on</span> <span className="bold-italic" style={{'color' : 'blue'}}>Discord</span> & <span className="bold-italic" style={{'color' : 'blue'}}>Telegram</span>.</li>
                <li>etc</li>
              </ul>
            </Panel>
          </Collapse>
        </div>
      <Form className="Editor" layout="vertical" onSubmit={this.handleSubmit}>
        <Helmet>
          <title>
            {intl.formatMessage({ id: 'write_post', defaultMessage: 'Write post' })} - DIY
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
                defaultMessage: 'FARMR (NED): ',
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
                defaultMessage: 'Add story topics here',
              })}
              dropdownStyle={{ display: 'none' }}
              tokenSeparators={[' ', ',']}
            />,
          )}
        </Form.Item>
        <div style={{ color : 'purple' }}>
          <span className="bold-italic">Farmr.club allows you to enjoy the entire steem ecosystem.</span> So, incase you change your mind and want to do a steemit post like normal, that's easy!!! Simply remove the default <span className="bold-italic">"FARMR (DIY):"</span> from Title above and kindly remove the default <span className="bold-italic">"#farmr & #farmr-diy"</span> from among the tags in the Hashtags box. <span className="bold-italic">(Please help us as we try to reserve #farmr, only for FARMR.)</span><br/><br/>
          Want to <span className="bold-italic">"mine the human"</span> some more? <b>You can also try one of our specialized editors above!!!</b>
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
          )}
          <Checkbox onChange={this.props.handleExtraMonetization} disabled={isUpdating}>
            <FormattedMessage id="extra_monetization" defaultMessage="Extra Monitezation" />
          </Checkbox>
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

export default EditorFarmrDIY;
