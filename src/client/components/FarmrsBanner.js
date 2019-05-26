import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import ReactMarkdown from 'react-markdown';
import './HeroBanner.less';
import './HeroBannerSlider.less';

const handleUserAccountClick = (event) => {
  event.preventDefault();
  const alertText = `This feature is available only to 'certified farmrs'. Kindly get ['certified'](https://farmr.club/@surpassinggoogle/do-you-want-to-become-certified-farmrs-kindly-fill-up-this-form-if-you-are-already-a-certified-farmr-there-is-a-separate), then contact [farmrs@gmail.com](mailto:farmrs@gmail.com) for further inquiries.`
  Modal.info({
    content: (
      <div>
        <p>
          <ReactMarkdown source={alertText} />
        </p>
      </div>
    ),
    onOk() {},
  });
};

const FarmrsBanner = ({ category }) => (
  <div className="HeroBanner">
    <div className="HeroBanner__container">
      <div className="HeroBanner__content-container">
        <div className="HeroBanner__content">
          <Link to={"/#"} onClick={handleUserAccountClick}>
            <span style={{fontSize: '72px'}}>( + )</span>
          </Link>
        </div>
      </div>
    </div>
  </div>
);
FarmrsBanner.propTypes = {
  category: PropTypes.string,
};
FarmrsBanner.defaultProps = {
  category: '',
};
export default FarmrsBanner;
