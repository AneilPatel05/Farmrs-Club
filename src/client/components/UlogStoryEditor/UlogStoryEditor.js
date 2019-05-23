import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { Input } from 'antd';
import uuidv4 from 'uuid/v4';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
  getAuthenticatedUser,
  getIsEditorLoading,
  getUpvoteSetting,
  getUloggersFollowingList,
} from '../../reducers';
import { isValidImage, MAXIMUM_UPLOAD_SIZE } from '../../helpers/image';
import { notify } from '../../app/Notification/notificationActions';
import withEditor from '../Editor/withEditor';
import { createPost } from '../../post/Write/editorActions';
import Avatar from '../Avatar';
import UlogStoryEditorFooter from './UlogStoryEditorFooter';
import './UlogStoryEditor.less';

const version = require('../../../../package.json').version;

@withRouter
@injectIntl
@withEditor
@connect(
  state => ({
    user: getAuthenticatedUser(state),
    postCreationLoading: getIsEditorLoading(state),
    upvote: getUpvoteSetting(state),
    certifiedUloggers: getUloggersFollowingList(state),
  }),
  {
    notify,
    createPost,
  },
)
class UlogStoryEditor extends React.Component {
  // component's property types for checking
  static propTypes = {
    postCreationLoading: PropTypes.bool.isRequired,
    user: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    notify: PropTypes.func.isRequired,
    createPost: PropTypes.func.isRequired,
    onImageUpload: PropTypes.func,
    onImageInvalid: PropTypes.func,
    upvote: PropTypes.bool.isRequired,
    certifiedUloggers: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  static defaultProps = {
    onImageUpload: () => {},
    onImageInvalid: () => {},
  };

  state = {
    noContent: false,
    imageUploading: false,
    dropzoneActive: false,
    currentInputValue: '',
    currentCategory: '',
    currentImages: [],
    focusedInput: false,
    inputMinRows: 1,
  };

  setInput = input => {
    if (input) {
      this.originalInput = input;
      // eslint-disable-next-line react/no-find-dom-node
      this.input = ReactDOM.findDOMNode(input);
    }
  };

  setInputCursorPosition = pos => {
    if (this.input && this.input.setSelectionRange) {
      this.input.setSelectionRange(pos, pos);
    }
  };

  getQuickPostData = () => {
    const images = _.map(this.state.currentImages, image => image.src);
    const postBody = _.reduce(
      this.state.currentImages,
      (str, image) => {
        const imageText = `![${image.name}](${image.src})\n`;
        return `${str}${imageText}`;
      },
      ' ',
    );
    const postTitle = this.state.currentInputValue;
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
    };

    if (images.length) {
      metaData.image = images;
    }

    // set 'ulog' as default tag, and selected category as second
    const ulogTag = 'ulog';
    const tag = this.state.currentCategory;
    const tags = [ulogTag];
    if (tag) {
      tags.push(tag)
    }
    metaData.tags = tags;

    data.parentPermlink = _.isEmpty(tag) ? ulogTag : tag;
    data.permlink = _.kebabCase(postTitle);
    data.jsonMetadata = metaData;

    return data;
  };

  insertImage = (image, imageName = 'image') => {
    if (!this.input) return;
    const newImage = {
      src: image,
      name: imageName,
      id: uuidv4(),
    };
    this.setState({
      currentImages: _.concat(this.state.currentImages, newImage),
      focusedInput: true,
    });
  };

  handleDrop = files => {
    if (files.length === 0) {
      this.setState({
        dropzoneActive: false,
      });
      return;
    }

    this.setState({
      dropzoneActive: false,
      imageUploading: true,
    });
    let callbacksCount = 0;
    Array.from(files).forEach(item => {
      this.props.onImageUpload(
        item,
        (image, imageName) => {
          callbacksCount += 1;
          this.insertImage(image, imageName);
          if (callbacksCount === files.length) {
            this.setState({
              imageUploading: false,
            });
          }
        },
        () => {
          this.setState({
            imageUploading: false,
          });
        },
      );
    });
  };

  handleImageChange = e => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target.files && e.target.files[0]) {
      if (!isValidImage(e.target.files[0])) {
        this.props.onImageInvalid();
        return;
      }

      this.setState({
        imageUploading: true,
      });
      this.props.onImageUpload(e.target.files[0], this.disableAndInsertImage, () =>
        this.setState({
          imageUploading: false,
        }),
      );
      // Input reacts on value change, so if user selects the same file nothing will happen.
      // We have to reset its value, so if same image is selected it will emit onChange event.
      e.target.value = '';
    }
  };

  handleDragEnter = () => this.setState({ dropzoneActive: true });

  handleDragLeave = () => this.setState({ dropzoneActive: false });

  disableAndInsertImage = (image, imageName = 'image') => {
    this.setState({
      imageUploading: false,
    });
    this.insertImage(image, imageName);
  };

  handleCreatePost = () => {
    if (_.isEmpty(this.state.currentInputValue)) {
      this.props.notify(
        this.props.intl.formatMessage({
          id: 'quick_post_error_empty_title',
          defaultMessage: 'Post title cannot be empty.',
        }),
        'error',
      );
      return;
    }
    const data = this.getQuickPostData();
    this.props.createPost(data);
  };

  handleUpdateCurrentInputValue = e =>
    this.setState({
      currentInputValue: e.target.value,
    });

  handleCategoryChange = value => {
    this.setState({
      currentCategory: value,
    });
  }

  handleRemoveImage = currentImage => {
    const imageIndex = _.findIndex(this.state.currentImages, image => image.id === currentImage.id);
    const currentImages = [...this.state.currentImages];
    currentImages.splice(imageIndex, 1);
    this.setState({ currentImages });
  };

  render() {
    const { imageUploading, focusedInput, currentImages, inputMinRows } = this.state;
    const { user, postCreationLoading, intl, certifiedUloggers } = this.props;
    const isCertifiedUlogger = certifiedUloggers.includes(user.name);

    return (
      <div className="UlogStoryEditor">
        <div className="UlogStoryEditor__contents">
          <div className="UlogStoryEditor__avatar">
            <Avatar username={user.name} size={40} />
          </div>
          <div className="UlogStoryEditor__dropzone-base">
            <Dropzone
              disableClick
              style={{ flex: 1 }}
              accept="image/*"
              maxSize={MAXIMUM_UPLOAD_SIZE}
              onDropRejected={this.props.onImageInvalid}
              onDrop={this.handleDrop}
              onDragEnter={this.handleDragEnter}
              onDragLeave={this.handleDragLeave}
            >
              {this.state.dropzoneActive && (
                <div className="UlogStoryEditor__dropzone">
                  <div>
                    <i className="iconfont icon-picture" />
                    <FormattedMessage id="drop_image" defaultMessage="Drop your images here" />
                  </div>
                </div>
              )}
              <Input.TextArea
                autosize={{ minRows: inputMinRows, maxRows: 12 }}
                onChange={this.handleUpdateCurrentInputValue}
                onBlur={this.handleUnfocusInput}
                ref={ref => this.setInput(ref)}
                placeholder={intl.formatMessage({
                  id: 'write_farmr_story',
                  defaultMessage: `Write a Farmr story...`,
                })}
                value={this.state.currentInputValue}
                maxLength="255"
              />
            </Dropzone>
          </div>
        </div>
        <UlogStoryEditorFooter
          imageUploading={imageUploading}
          postCreationLoading={postCreationLoading}
          isCertifiedUlogger={isCertifiedUlogger}
          handleCreatePost={this.handleCreatePost}
          handleImageChange={this.handleImageChange}
          handleCategoryChange={this.handleCategoryChange}
          postText={intl.formatMessage({
            id: 'post_send',
            defaultMessage: 'Post',
          })}
          submittingPostText={intl.formatMessage({
            id: 'post_send_progress',
            defaultMessage: 'Submitting',
          })}
          currentImages={currentImages}
          onRemoveImage={this.handleRemoveImage}
          handleFooterFocus={this.handleFocusInput}
        />
      </div>
    );
  }
}

export default UlogStoryEditor;
