import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { message, Collapse, Button, List, Form, Input } from 'antd';
import ReactMarkdown from 'react-markdown';
import steemAPI from '../steemAPI';
import { getAuthenticatedUser, getIsEditorLoading, getUpvoteSetting } from '../reducers';
import Action from '../components/Button/Action';
import { notify } from '../app/Notification/notificationActions';
import { createPost } from '../post/Write/editorActions';
import * as community from '../helpers/community';

const version = require('../../../package.json').version;

@injectIntl
@connect(
  state => ({
    user: getAuthenticatedUser(state),
    postCreationLoading: getIsEditorLoading(state),
    upvote: getUpvoteSetting(state),
  }),
  {
    notify,
    createPost,
  },
)
@Form.create()
class CreateCommunity extends React.Component {
  static propTypes = {
    postCreationLoading: PropTypes.bool.isRequired,
    upvote: PropTypes.bool.isRequired,
    user: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    community: PropTypes.string,
    form: PropTypes.shape().isRequired,
    notify: PropTypes.func.isRequired,
    createPost: PropTypes.func.isRequired,
  };

  static defaultProps = {
    community: '',
    currentInputValue: '',
    visible: false,
  };

  static minAccountLength = 3;
  static maxAccountLength = 16;

  constructor(props) {
    super(props);
    // bind the component's methods so that it can be called within render() using this.method()
    this.validateCommunity = this.validateCommunity.bind(this);
    this.handleCreatePost = this.handleCreatePost.bind(this);
  }

  /*
   * Validate inputted community name
   */
  validateCommunity = (rule, value, callback) => {
    const { intl } = this.props;

    if (!value) {
      callback();
      return;
    }

    // prefix the community name with 'ulog-'
    const ulogSubTag = 'ulog-' + value;

    // if subtag is less than min length
    if (ulogSubTag.length < CreateCommunity.minAccountLength) {
      callback([
        new Error(
          intl.formatMessage(
            {
              id: 'subtag_too_short',
              defaultMessage: 'Farmr subtag {subtag} is too short.',
            },
            {
              subtag: ulogSubTag,
            },
          ),
        ),
      ]);
      return;
    }

    // if subtag is more than max length
    if (ulogSubTag.length > CreateCommunity.maxAccountLength) {
      callback([
        new Error(
          intl.formatMessage(
            {
              id: 'subtag_too_long',
              defaultMessage: 'Farmr subtag {subtag} is too long.',
            },
            {
              subtag: ulogSubTag,
            },
          ),
        ),
      ]);
      return;
    }

    // check if subtag already exists by using get_discussions API
    steemAPI.sendAsync('get_discussions_by_created', [{ tag: ulogSubTag, limit: 1 }]).then(result => {
      // if no posts already exists, return without error
      if (result.length === 0) {
        callback();
      } else {
        callback([
          new Error(
            intl.formatMessage(
              {
                id: 'community_error_found_tag',
                defaultMessage: "Farmr community {subtag} already exists. Please try another one.",
              },
              {
                subtag: ulogSubTag,
              },
            ),
          ),
        ]);
      }
    });
  };

  /*
   * Helper function to generate post data
   */
  getQuickPostData = () => {
    const { form } = this.props;
    const postBody = "";
    const community = form.getFieldValue('community');
    const ulogSubTag = "ulog-" + community;
    const postTitle = `A New Farmr Community - ${ulogSubTag} - Has Been Created!`;
    const tags = [ulogSubTag];
    const data = {
      body: postBody,
      title: postTitle,
      reward: '50',
      author: this.props.user.name,
      parentAuthor: '',
      lastUpdated: Date.now(),
      upvote: this.props.upvote,
    };

    const metaData = {
      community: 'ulogs',
      app: `ulogs/${version}`,
      format: 'markdown',
      tags,
    };

    data.parentPermlink = ulogSubTag;
    data.permlink = _.kebabCase(postTitle);
    data.jsonMetadata = metaData;

    return data;
  };

  /*
   * Post creation handler when "Create Community" is clicked
   */
  handleCreatePost = (e) => {
    e.preventDefault();

    const { form } = this.props;
    // validate form fields
    form.validateFieldsAndScroll((err, values) => {
      // If no error, continue to submit community creation (create a post)
      if (!err) {
        const community = values.community;
        const ulogSubTag = "ulog-" + community;

        if (_.isEmpty(ulogSubTag)) {
          this.props.notify(
            this.props.intl.formatMessage({
              id: 'community_error_empty_name',
              defaultMessage: 'Community name cannot be empty.',
            }),
            'error',
          );
          return;
        }
        const data = this.getQuickPostData();
        this.props.createPost(data);
      }
    });
  };

  render() {
    const { intl, postCreationLoading } = this.props;
    const { getFieldDecorator } = this.props.form;

    // Style for the 'About' description
    const customPanelStyle = {
      marginBottom: 5,
      overflow: 'hidden',
    };

    // Style for the sections
    const customCardStyle = {
      marginBottom: '10px',
      marginTop: '10px',
    };

    return (
      <div className="shifted">
        <div className="container">
          <div className="center" style={{ marginBottom: '50px' }}>
            <h2 style={{ color: 'purple', textAlign: 'center' }}>Create A Farmr-Community</h2>
            <Collapse defaultActiveKey={['1']}>
              <Collapse.Panel header="About Communities" key="1" style={customPanelStyle}>
                <ReactMarkdown source={community.aboutCommunities} />
              </Collapse.Panel>
            </Collapse>

            <Collapse defaultActiveKey={['1']}>
              <Collapse.Panel showArrow={false} key="1" disabled>
                <List itemLayout="vertical" size="large">
                  <List.Item
                    key="Create A Farmr-Community"
                  >
                    <h3>Create A Farmr-Community</h3>
                    <div style={customCardStyle}>
                      <ReactMarkdown source={community.createCommunity} />
                    </div>
                    <Form onSubmit={this.handleCreatePost}>
                      <Form.Item>
                      {getFieldDecorator('community', {
                        rules: [
                          {
                            required: true,
                            message: intl.formatMessage({
                              id: 'community_error_empty',
                              defaultMessage: 'Community is required.',
                            }),
                          },
                          { validator: this.validateCommunity },
                        ],
                      })(
                        <Input
                          type="text"
                          placeholder="Names should be a maximum of 19 characters, only alphabets, no special characters."
                        />
                      )}
                      </Form.Item>
                      <Action
                        primary
                        type="submit"
                        loading={postCreationLoading}
                        disabled={postCreationLoading}
                      >
                        {postCreationLoading ? "Creating Community..." : "Create Now"}
                      </Action>
                    </Form>
                  </List.Item>
                </List>
              </Collapse.Panel>
            </Collapse>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateCommunity;
