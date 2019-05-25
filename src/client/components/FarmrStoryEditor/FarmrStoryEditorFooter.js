import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import { Icon, Select } from 'antd';
import ReactMarkdown from 'react-markdown';
import Action from '../Button/Action';
import { farmrStoriesTags } from '../../helpers/constants';

const Option = Select.Option;

const FarmrStoryEditorFooter = ({
  currentImages,
  imageUploading,
  postCreationLoading,
  isCertifiedFarmr,
  handleCreatePost,
  handleImageChange,
  handleCategoryChange,
  postText,
  submittingPostText,
  onRemoveImage,
  handleFooterFocus,
}) => (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
  <div className="FarmrStoryEditor__footer" tabIndex="0" onFocus={handleFooterFocus}>
    <div className="FarmrStoryEditor__imagebox">
      {_.map(currentImages, image => (
        <div className="FarmrStoryEditor__imagebox__preview__image" key={image.id}>
          <div
            className="FarmrStoryEditor__imagebox__remove"
            onClick={() => onRemoveImage(image)}
            role="presentation"
          >
            <i className="iconfont icon-delete_fill FarmrStoryEditor__imagebox__remove__icon" />
          </div>
          <img src={image.src} width="38" height="38" alt={image.src} />
        </div>
      ))}
      <input
        id="inputfile"
        className="FarmrStoryEditor__footer__file"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      <label htmlFor="inputfile">
        {imageUploading ? (
          <div className="FarmrStoryEditor__imagebox__loading">
            <Icon type="loading" />
          </div>
        ) : (
          <div
            className={classNames({
              FarmrStoryEditor__imagebox__upload: !_.isEmpty(currentImages),
            })}
          >
            <i
              className={classNames('iconfont FarmrStoryEditor__imagebox__upload__icon', {
                'icon-picture': _.isEmpty(currentImages),
                'icon-add': !_.isEmpty(currentImages),
              })}
            />
          </div>
        )}
      </label>
    </div>
    <Select
      style={{ flex: "1 0", margin: "5px" }}
      onChange={handleCategoryChange}
    >
      {_.map(farmrStoriesTags, category => (
        <Option value={category} key={category}>#{category}</Option>
      ))}
    </Select>
    <Action
      primary
      loading={postCreationLoading}
      disabled={postCreationLoading}
      onClick={handleCreatePost}
    >
      {postCreationLoading ? submittingPostText : postText}
    </Action>
    {!isCertifiedFarmr &&
      <div>
        <ReactMarkdown source={`Please note that while you will be able to successfully post to steem and of course have your post appear on farmr.club (as a post), your post will not be displayed on our "Farmr-Stories" display-column as this column is reserved for "certified farmrs" only. However, every(any)one can become "certified". We invite you to contact us!`} />
      </div>
    }
  </div>
);

FarmrStoryEditorFooter.propTypes = {
  currentImages: PropTypes.arrayOf(PropTypes.shape()),
  imageUploading: PropTypes.bool,
  postCreationLoading: PropTypes.bool,
  postText: PropTypes.string,
  submittingPostText: PropTypes.string,
  handleCreatePost: PropTypes.func,
  handleImageChange: PropTypes.func,
  handleCategoryChange: PropTypes.func,
  onRemoveImage: PropTypes.func,
  handleFooterFocus: PropTypes.func,
};

FarmrStoryEditorFooter.defaultProps = {
  currentImages: [],
  imageUploading: false,
  postCreationLoading: false,
  postText: 'Post',
  submittingPostText: 'Submitting',
  handleCreatePost: () => {},
  handleImageChange: () => {},
  handleCategoryChange: () => {},
  onRemoveImage: () => {},
  handleFooterFocus: () => {},
};

export default FarmrStoryEditorFooter;
