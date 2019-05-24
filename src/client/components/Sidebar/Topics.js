import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Topic from '../Button/Topic';
import Loading from '../Icon/Loading';
import ulogTopics from '../../helpers/ulogTopics';
import './Topics.less';

class Topics extends React.Component {
  static propTypes = {
    favorite: PropTypes.bool,
    topics: PropTypes.arrayOf(PropTypes.string),
    maxItems: PropTypes.number,
    maxFarmrTopics: PropTypes.number,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    favorite: false,
    topics: [],
    maxItems: 5,
    maxFarmrTopics: 7,
    loading: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
      showMoreFarmrTopics: false,
    };
  }

  changeVisibility(showMore) {
    this.setState({ showMore });
  }

  changeMoreFarmrTopicsVisibility(showMoreFarmrTopics) {
    this.setState({ showMoreFarmrTopics });
  }

  render() {
    const { topics, favorite, maxItems, maxFarmrTopics, loading } = this.props;

    const displayedTopics = this.state.showMore ? topics : topics.slice(0, maxItems);
    const displayedFarmrTopics = this.state.showMoreFarmrTopics ? ulogTopics : ulogTopics.slice(0, maxFarmrTopics);

    return (
      <div className="Topics">
        <h4>
          <FormattedMessage
            id={'farmr_and_farmr_subtags'}
            defaultMessage={'Farmr.club & Farmr.club sub-tags'}
          />
        </h4>
        {loading && <Loading center={false} />}
        {!loading && (
          <ul className="Topics__list">
            {displayedFarmrTopics.map(topic => (
              <li key={topic}>
                <Topic name={topic} favorite={favorite} />
              </li>
            ))}
          </ul>
        )}
        {!loading && ulogTopics.length > maxFarmrTopics && !this.state.showMoreFarmrTopics ? (
          <a role="button" tabIndex={0} onClick={() => this.changeMoreFarmrTopicsVisibility(true)}>
            <FormattedMessage id="show_more" defaultMessage="View more" />
          </a>
        ) : null}
        {!loading && ulogTopics.length > maxFarmrTopics && this.state.showMoreFarmrTopics ? (
          <a role="button" tabIndex={0} onClick={() => this.changeMoreFarmrTopicsVisibility(false)}>
            <FormattedMessage id="show_less" defaultMessage="View less" />
          </a>
        ) : null}
        <h4>
          <FormattedMessage
            id={favorite ? 'favorite_topics' : 'steem_hashtags'}
            defaultMessage={favorite ? 'Favorite topics' : 'Steem Hashtags'}
          />
        </h4>
        {loading && <Loading center={false} />}
        {!loading && (
          <ul className="Topics__list">
            {/* <li key='teardrops'>
                          <Topic name='teardrops' favorite={favorite} />
                        </li>
                        <li key='untalented'>
                          <Topic name='untalented' favorite={favorite} />
                        </li>
                        <li key='surpassinggoogle'>
                          <Topic name='surpassinggoogle' favorite={favorite} />
                        </li> */}
            {displayedTopics.map(topic => (
              <li key={topic}>
                <Topic name={topic} favorite={favorite} />
              </li>
            ))}
          </ul>
        )}
        {!loading && topics.length > maxItems && !this.state.showMore ? (
          <a role="button" tabIndex={0} onClick={() => this.changeVisibility(true)}>
            <FormattedMessage id="show_more" defaultMessage="View more" />
          </a>
        ) : null}
        {!loading && topics.length > maxItems && this.state.showMore ? (
          <a role="button" tabIndex={0} onClick={() => this.changeVisibility(false)}>
            <FormattedMessage id="show_less" defaultMessage="View less" />
          </a>
        ) : null}

        <h4>
          <FormattedMessage
            id={'explore'}
            defaultMessage={'Explore'}
          />
        </h4>
          <ul className="Topics__list">
            <li>
            <Topic name={'Farmr.club Communities'} favorite={favorite} />
            </li>
            <li>
              <Topic name={'Exchanges'} favorite={favorite} />
            </li>
            <li>
              <Topic name={'Giveaways'} favorite={favorite} />
            </li>
            <li>
              <Topic name={'Crowdfunds'} favorite={favorite} />
            </li>
            <br/>
          </ul>
      </div>
    );
  }
}

export default Topics;
