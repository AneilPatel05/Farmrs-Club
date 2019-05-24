import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar';
import './User.less';

const FarmrGamesExchangesUser = ({ story, authenticated }) => (
  <div className="User__links_overflow_x_auto" key={story.permlink}>
    {authenticated && (
      <Link to={`/@${story.author}/${story.permlink}`} >
        <Avatar username={story.author} size={34} />
      </Link>
    )}
    {!authenticated && (
      <a target="_blank" rel="noopener noreferrer" href={process.env.SIGNUP_URL}>
        <Avatar username={story.author} size={34} />
      </a>
    )}
  </div>
);

FarmrGamesExchangesUser.propTypes = {
  story: PropTypes.shape().isRequired,
  authenticated: PropTypes.bool.isRequired,
};

export default FarmrGamesExchangesUser;
