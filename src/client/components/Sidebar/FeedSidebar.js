import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  getIsAuthenticated,
  getRecommendations,
  getAuthenticatedUser,
} from '../../reducers';
import { getCryptoDetails } from '../../helpers/cryptosHelper';
import { updateRecommendations } from '../../user/userActions';
import OverseeingFarmrs from './OverseeingFarmrs';
import CryptoTrendingCharts from './CryptoTrendingCharts';
import ChatBar from '../../components/Sidebar/ChatBar';
import FarmrGamesExchanges from '../../components/Sidebar/FarmrGamesExchanges';
import FarmrCaption from '../../feed/FarmrCaption';
import FarmrGenericCaption from '../../feed/FarmrGenericCaption';

@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    recommendations: getRecommendations(state),
  }),
  { updateRecommendations },
)
class FeedSidebar extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    authenticatedUser: PropTypes.shape().isRequired,
    recommendations: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })).isRequired,
    updateRecommendations: PropTypes.func.isRequired,
    match: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);
    this.handleInterestingPeopleRefresh = this.handleInterestingPeopleRefresh.bind(this);
  }

  handleInterestingPeopleRefresh() {
    this.props.updateRecommendations();
  }

  render() {
    const { authenticated, authenticatedUser, recommendations, match } = this.props;
    const isAuthenticated = authenticated && recommendations.length > 0;
    const currentTag = _.get(this.props, 'match.params.tag', '');
    const currentCrypto = getCryptoDetails(currentTag);
    const { tag } = match.params;
    const displayFarmrCaption =
      tag &&
      tag.match(
        /^(farmr-quotes|farmr-howto|farmr-diy|farmr-surpassinggoogle|teardrops|untalented|farmr-ned|photography|farmr-gratefulvibes|farmr-resolutions|farmr-memes|farmr-blocktrades|farmr-showerthoughts|farmr-snookmademedoit|farmr-utopian|farmr-thejohalfiles|gifs|farmr-surfyogi|farmr-bobbylee|farmr-stellabelle|farmr-sweetsssj|farmr-dimimp|farmr-teamsteem|farmr-kusknee|farmr-papapepper|farmr-steemjet)$/,
      );
    const isStartsWithFarmr = tag && tag.startsWith('farmr-');
    return (
      <div>
        {!_.isEmpty(currentCrypto) && <CryptoTrendingCharts cryptos={[currentTag]} />}
        <React.Fragment>
          {displayFarmrCaption && <FarmrCaption category={tag} />}
          {(!displayFarmrCaption && isStartsWithFarmr) && <FarmrGenericCaption category={tag} />}
          <OverseeingFarmrs authenticatedUser={authenticatedUser} />
          <FarmrGamesExchanges isFetchingFollowingList={false} />
          <ChatBar isFetchingFollowingList={false} authenticated={authenticated} />
        </React.Fragment>
      </div>
    );
  }
}

export default FeedSidebar;
