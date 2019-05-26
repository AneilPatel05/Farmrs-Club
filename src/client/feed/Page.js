import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import ReactMarkdown from 'react-markdown';
import { Carousel, Collapse } from 'antd';
import YoutubePlayer from 'react-player/lib/players/YouTube';
import { getFeedContent } from './feedActions';
import { getIsLoaded, getIsAuthenticated } from '../reducers';
import SubFeed from './SubFeed';
import HeroBannerContainer from './HeroBannerContainer';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import TopicSelector from '../components/TopicSelector';
import TrendingTagsMenu from '../components/TrendingTagsMenu';
import Affix from '../components/Utils/Affix';
import ScrollToTop from '../components/Utils/ScrollToTop';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import QuickPostEditor from '../components/QuickPostEditor/QuickPostEditor';
import MainMenu from '../components/MainMenu';
import FarmrsBanner from '../components/FarmrsBanner';
import './Feed.less';

@connect(state => ({
  authenticated: getIsAuthenticated(state),
  loaded: getIsLoaded(state),
}))
class Page extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired,
    history: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
  };

  static fetchData({ store, match }) {
    const { sortBy, category } = match.params;
    return store.dispatch(getFeedContent({ sortBy, category, limit: 10 }));
  }

  handleSortChange = key => {
    const { category } = this.props.match.params;
    if (category) {
      this.props.history.push(`/${key}/${category}`);
    } else {
      this.props.history.push(`/${key}`);
    }
  };

  handleTopicClose = () => this.props.history.push('/trending');

  render() {
    const { authenticated, loaded, location, match } = this.props;
    const { category, sortBy } = match.params;

    const shouldDisplaySelector = location.pathname !== '/' || (!authenticated && loaded);
    const displayTopicSelector = location.pathname === '/trending';
    const robots = location.pathname === '/' ? 'index,follow' : 'noindex,follow';
    const displayFarmrCaption =
      category &&
      category.match(
        /^(farmr-quotes|farmr-howto|farmr-diy|farmr-surpassinggoogle|teardrops|untalented|farmr-ned|photography|farmr-gratefulvibes|farmr-resolutions|farmr-memes|farmr-blocktrades|farmr-showerthoughts|farmr-snookmademedoit|farmr-utopian|farmr-thejohalfiles|gifs|farmr-surfyogi|farmr-bobbylee|farmr-stellabelle|farmr-sweetsssj|farmr-dimimp|farmr-teamsteem|farmr-kusknee|farmr-papapepper|farmr-steemjet)$/,
      );
    const isStartsWithFarmr = category && category.startsWith('farmr-');

    const convertFarmrTag = `Thank you for beginning the process of creating a Farmr-Community. To further the process, start by contributing farmr under this very farmr-subtag and inviting others to do the same. You can start now! Simply visit this editor on 'https://farmr.club/main-editor' to contribute a farmr and make sure to use the farmr-subtag here as one of the tags underneath your post.&nbsp;
      To complete the process of creating a Farmr-Community, kindly send an email containing your intention to [farmrs@gmail.com](mailto:farmrs@gmail.com) &nbsp;
      Note: Anyone can choose to complete the process!`

    return (
      <div>
        <Helmet>
          <title>Farmr.club</title>
          <meta name="robots" content={robots} />
        </Helmet>
        <ScrollToTop />

        <ScrollToTopOnMount />
        {(authenticated && !displayFarmrCaption && !isStartsWithFarmr) ? (
          <Carousel autoplay className="feed-carousel">
            <div>
              <a href="farmr/@farmrs/farmrs-today-s-certified-and-verified-farmr-true-celebrity-is-jejes-join-in-as-her-true-fans-we-will-fix-many-worries">
                <img width={'100%'} height={'100%'} alt="900x500" src="/images/slide1.jpg" />
              </a>
            </div>
            <YoutubePlayer
              className="youtube-player"
              url="https://youtu.be/5tq_rCZURUg"
              width="100%"
              controls
            />
            <div>
              <a href="farmr/@farmrs/farmrs-today-s-certified-and-verified-farmr-true-celebrity-is-enjieneer-join-in-as-her-true-fans-we-will-fix-many-worries">
                <img width={'100%'} height={'100%'} alt="900x500" src="/images/slide2.jpg" />
              </a>
            </div>
            <YoutubePlayer
              className="youtube-player"
              url="https://youtu.be/pKoW5HJ1l84"
              width="100%"
              controls
            />
            <YoutubePlayer
              className="youtube-player"
              url="https://youtu.be/K8G97hEls_U"
              width="100%"
              controls
            />
            <div>
              <a href="farmr/@farmrs/farmrs-today-s-certified-and-verified-farmr-true-celebrity-is-kneelyrac-join-in-as-her-true-fans-we-will-fix-many-worries">
                <img width={'100%'} height={'100%'} alt="900x500" src="/images/slide3.jpg" />
              </a>
            </div>
            <YoutubePlayer
              className="youtube-player"
              url="https://youtu.be/kKZ1CixLG2s"
              width="100%"
              controls
            />
            <YoutubePlayer
              className="youtube-player"
              url="https://youtu.be/UqNsKU4lnLo"
              width="100%"
              controls
            />
            <div>
              <a href="farmr/@farmrs/farmrs-today-s-certified-and-verified-farmr-true-celebrity-is-sn0white-join-in-as-her-true-fans-we-will-fix-many-worries">
                <img width={'100%'} height={'100%'} alt="900x500" src="/images/slide4.jpg" />
              </a>
            </div>
            <YoutubePlayer
              className="youtube-player"
              url="https://youtu.be/MAPKUato1K8"
              width="100%"
              controls
            />
          </Carousel>
        ) : (
          <HeroBannerContainer />
        )}
        {(authenticated && displayFarmrCaption) && <FarmrsBanner category={category} />}
        {(authenticated && !displayFarmrCaption && isStartsWithFarmr) && <FarmrsBanner category={category} />}
        <MainMenu />
        <div className="shifted">
          <div className="feed-layout container">
            <Affix className="leftContainer" stickPosition={77}>
              <div className="left">
                <LeftSidebar />
              </div>
            </Affix>
            <Affix className="rightContainer" stickPosition={77}>
              <div className="right">
                <RightSidebar />
              </div>
            </Affix>
            <div className="center">
              {(!displayFarmrCaption && isStartsWithFarmr) &&
                <Collapse>
                  <Collapse.Panel header={'Convert #' + category + ' To A Farmr-Community'} key="1">
                    <p>
                      <ReactMarkdown source={convertFarmrTag} />
                    </p>
                  </Collapse.Panel>
                </Collapse>
              }
              {displayTopicSelector && <TrendingTagsMenu />}
              {shouldDisplaySelector && (
                <TopicSelector
                  isSingle={false}
                  sort={sortBy}
                  topics={category ? [category] : []}
                  onSortChange={this.handleSortChange}
                  onTopicClose={this.handleTopicClose}
                />
              )}
              {authenticated && <QuickPostEditor />}
              <SubFeed />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Page;
