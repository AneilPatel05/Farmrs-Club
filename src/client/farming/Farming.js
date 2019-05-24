import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { Layout, Card, Icon, Avatar, Row, Col, Collapse, Menu, Dropdown, Button } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import DiscoverContent from './DiscoverContent';
import Affix from '../components/Utils/Affix';
import './Discover.less';
import LastDraftsContainer from '../post/Write/LastDraftsContainer';
import Editor from '../components/Editor/Editor';

@injectIntl
class Farming extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
  };

  state = {
    activeKey: [],
  }

  constructor(props) {
    super(props);

    let defaultActiveKey = [];
    const location = this.props.location.pathname.split('/')[1];
    if (location === 'art-of-farming') {
      defaultActiveKey = ['1'];
    } else if (location === 'main-editor') {
      defaultActiveKey = ['2'];
    } else if (location === 'ulog-knowledge-bank') {
      defaultActiveKey = ['3'];
    } else if (location === 'ulog-fanlove') {
      defaultActiveKey = ['4'];
    } else if (location === 'surpassinggoogle') {
      defaultActiveKey = ['5'];
    } else if (location === 'teardrops-editor') {
      defaultActiveKey = ['6'];
    } else if (location === 'untalented-editor') {
      defaultActiveKey = ['7'];
    } else if (location === 'general-editor') {
      defaultActiveKey = ['8'];
    } else {
      defaultActiveKey = ['0'];
    }
    this.state = { activeKey: defaultActiveKey };
  }

  callback = (key) => {
    this.setState({ activeKey: key });
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      const location = this.props.location.pathname.split('/')[1];
      if (location === 'art-of-farming') {
        this.setState({ activeKey : ['1']});
      } else if (location === 'main-editor') {
        this.setState({ activeKey : ['2']});
      } else if (location === 'ulog-knowledge-bank') {
        this.setState({ activeKey : ['3']});
      } else if (location === 'ulog-fanlove') {
        this.setState({ activeKey : ['4']});
      } else if (location === 'surpassinggoogle') {
        this.setState({ activeKey : ['5']});
      } else if (location === 'teardrops-editor') {
        this.setState({ activeKey : ['6']});
      } else if (location === 'untalented-editor') {
        this.setState({ activeKey : ['7']});
      } else if (location === 'general-editor') {
        this.setState({ activeKey : ['8']});
      } else {
        this.setState({ activeKey : ['0']});
      }
    }
  }

  render() {

    const menu = (
      <Menu>
        <Menu.Item key="1">
          <Link to={'/farming/#art-of-farming'}>The art of FARMR</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to={'/farming/#main-editor'}>Go To The Main Ulog Editor</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to={'/farming#knowledge-bank'}>ULOG-KnowledgeBank</Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to={'/farming#surpassing-google'}>SurpassingGoogle</Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Link to={'/farming#be-like-terry'}>BeLikeTerry (Fan Love)</Link>
        </Menu.Item>
        <Menu.Item key="6">
          <Link to={'/farming#teardrops-editor'}>Go To The #teardrops Editor</Link>
        </Menu.Item>
        <Menu.Item key="7">
          <Link to={'/farming#untalented-editor'}>Go To The #untalented Editor</Link>
        </Menu.Item>
        <Menu.Item key="8">
          <Link to={'/farming#general-editor'}>Go To Our General-Purpose Editor</Link>
        </Menu.Item>
      </Menu>
    );

    const knowledgeBankMenu = (
      <Menu>
        <Menu.Item key="0">
          <Link to={'/ulog-diy'}>#farmr-diy (Fresh DIY per day)</Link>
        </Menu.Item>
        <Menu.Item key="1">
          <Link to={'/ulog-howto'}>#farmr-howto</Link>
        </Menu.Item>
      </Menu>
    );

    const fanLoveMenu = (
      <Menu>
        <Menu.Item key="0">
          <Link to={'/ulog-ned'}>#farmr-ned (Emulate, Learn, Gratitude, Celebrate etc @ned)</Link>
        </Menu.Item>
        <Menu.Item key="1">
          <Link to={'/ulog-surpassinggoogle'}>#farmr-surpassinggoogle (Emulate, Learn, Gratitude, Celebrate etc @surpassinggoogle)</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to={'/ulog-quotes'}>#farmr-quotes</Link>
        </Menu.Item>
      </Menu>
    );

    const surpassingGoogleMenu = (
      <Menu>
        <Menu.Item key="0">
          <Link to={'/teardrops'}>#teardrops (Share your teardrops moments, happy/sad/un-fell etc)</Link>
        </Menu.Item>
        <Menu.Item key="1">
          <Link to={'/untalented'}>#untalented (Share all levels of talent/attempts/out-of-the-boxness)</Link>
        </Menu.Item>
      </Menu>
    );

    const customPanelStyle = {
      marginBottom: 5,
      overflow: 'hidden',
      textAlign: 'center',
    };

    const customCardStyle = {
      marginBottom: 8,
      marginTop: 8,
      border: '2px solid purple',
      color: 'purple',
      textAlign: 'center',
      borderRadius: '5px',
    };

    const location = this.props.location.pathname.split('/')[1];
    let defaultActiveKey = [];
    if (location === 'art-of-farming') {
      defaultActiveKey = ['1'];
    } else if (location === 'main-editor') {
      defaultActiveKey = ['2'];
    } else if (location === 'ulog-knowledge-bank') {
      defaultActiveKey = ['3'];
    } else if (location === 'ulog-fanlove') {
      defaultActiveKey = ['4'];
    } else if (location === 'surpassinggoogle') {
      defaultActiveKey = ['5'];
    } else if (location === 'teardrops-editor') {
      defaultActiveKey = ['6'];
    } else if (location === 'untalented-editor') {
      defaultActiveKey = ['7'];
    } else if (location === 'general-editor') {
      defaultActiveKey = ['8'];
    } else {
      defaultActiveKey = ['0'];
    }

    return (
      <div className="shifted">
        <div className="post-layout container">
          <Affix className="rightContainer" stickPosition={77}>
            <div className="right">
              <LastDraftsContainer />
            </div>
          </Affix>
          <div className="center" style={{marginBottom: '50px'}}>
            <h2 style={{ color: 'purple', textDecoration: 'underline', textAlign: 'center'}}>On Farmr.club, Your Content Is Queen</h2>
            <h5 style={{ color: 'purple', fontStyle: 'italic', textAlign: 'center', marginBottom: '3px'}}>Be inventive. Try out one of our content-creation editors below</h5>
            <Collapse
              defaultActiveKey={defaultActiveKey}
              activeKey={this.state.activeKey}
              onChange={this.callback}>
              <Collapse.Panel
                header="The art of FARMR"
                key="1"
                style={customPanelStyle}>
                <p>
                  The art of FARMR is a conscious effort to "mine the human" into its **"awesomest version", while reshaping the entire INTERNET and creating legends, icons, great men and women, brothers and "True Celebrities". <br/>
                  Together FARMR, we will remove "all barriers to entry" for content-creation, content-curation and steem-promotion, "making steeming as difficult as 1, 2, 3". <br/>
                  We will own our very cookies; we will re-tap into our shine and recover lost shine. We will fly. ("True Celebrity-hood" for "everyone" once and for all") <br/>
                  In due time, we will celebrate breakthrough with the @teardrops Smart Media Token; "@surpassinggoogle". <br/><br/>
                  <u>Special Note:</u> Everytime you make use of farmr.club to post, comment etc, you are supporting steemians, projects, FARMRS etc by being their "true fans". Too, you "mine the human" some more, becoming "true celebrities". You will also give back to steem/steemit in gratitude as we contribute a "negligible sum" from our rewards with Steemit INC as beneficiary. <br/>
                </p>
              </Collapse.Panel>
            </Collapse>

            <Card
              bordered={false}
              bodyStyle={customCardStyle}>
              <h3 style={{color: 'purple'}}>Write A Ulog?</h3>
              <p>
                Writing a ulog is easier with the right editor. Simply expand the tab below to choose the appropriate editor.<br/>
                Farming is for "everyone", both private and public figures!<br/>
              </p>
            </Card>

            <Collapse
              defaultActiveKey={defaultActiveKey}
              activeKey={this.state.activeKey}
              onChange={this.callback}>
              <Collapse.Panel
                header="Go To The Main Ulog Editor"
                key="2"
                style={customPanelStyle}>
                <p>
                  You can write an <b>entire ulog</b> today, with the aim of <b>recounting your entire day</b> and all the activities in it. The <b>U</b> in <b>U</b>log stands for "You".<br/>
                  <i>Farming is for both public & private figures.</i><br/>
                  <b>A ulog</b> is a kind of content that is <b>freshly-created by "You"</b>, containing only experiences, events, feelings, moments, knowledge etc <b>drawn from a particular day.</b><br/>
                  <b>A ulog written today</b>, should not have existed anywhere online, yesterday; as <i>"each day and 'you' in it, carries its own freshness.</i><br/>
                  Our aim while farming is to <b>"mine the human into its awesomest version"</b>, while managing to <i>reshape the entire internet</i>. Thus, while farming, we aim to <b>gift the internet with our "freshly-made" content</b>, at least once a day, <b>instead of resourcing from the internet.</b><br/>
                  You can write an entire ulog right now. To do so, simply select our <b>"main ulog editor"</b> below.<br/><br/>
                </p>
                <Button>
                  <Link to="/main-editor">Main Ulog Editor</Link>
                </Button>
              </Collapse.Panel>
            </Collapse>

            <Card
              bordered={false}
              bodyStyle={customCardStyle}>
              <h3 style={{color: 'purple'}}>Do You Want To Ulog Under A Ulog-Subtag?</h3>
              <p>
                Farming under a ulogsubtag allows you to contribute ulogs to specific niches (per day). This further simplifies "the art of farming", while maintaining the power and essence of farming.<br/>
                Simply expand any of the tabs below, to select an appropriate specialized editor.<br/>
              </p>
            </Card>

            <Collapse
              defaultActiveKey={defaultActiveKey}
              activeKey={this.state.activeKey}
              onChange={this.callback}>
              <Collapse.Panel
                header="ULOG-Knowledge-Bank"
                key="3"
                style={customPanelStyle}>
                <p>
                  We like to reward #farming contributions born solely out of <i>"your experience"</i> per day. We seek to incentivize you to learn something new per day, for the sake of #farming. This way, <i>"not a day slips emptily by"</i> and not a day aren't you capable of reshaping the INTERNET; touching your <i>"true fans"</i> and attaining <i>"true celebrity-hood"</i> etc <br/>
                  Deposit to our Knowledge-bank by trying one of our #farming editors from the dropdown below. Withdraw knowledge by using the search box above. <br/>
                </p>
                <Dropdown overlay={knowledgeBankMenu} trigger={['click']}>
                  <Button>
                    Select An Editor <Icon type="down" />
                  </Button>
                </Dropdown>
              </Collapse.Panel>

              <Collapse.Panel
                header="ULOG-fanlove (BeLikeTerry)"
                key="4"
                style={customPanelStyle}>
                <p>
                  To become like me, you will need to stubbornly become the <i>"awesomest version of YOU"</i>. @surpassinggoogle <br/>
                  Choose an editor from the dropdown below to be <i>"true fans"</i> of a project, community, ULOGGER, steemian etc by using your #farming to emulate, show gratitude, learn about, write about, share moments with etc (per day for freshness). <br/>
                  e.g you can learn about Ned for the sake of <i>#farming under #farmr-ned</i> etc You will also be able to do likewise for projects, communities etc <br/>
                </p>
                <Dropdown overlay={fanLoveMenu} trigger={['click']}>
                  <Button>
                    Select An Editor <Icon type="down" />
                  </Button>
                </Dropdown>
              </Collapse.Panel>

              <Collapse.Panel
                header="SurpassingGoogle"
                key="5"
                style={customPanelStyle}>
                <p>
                  Note that farmr.club integrates 4 websites into one. Thus, we are integrating all the paradigms from SurpassingGoogle, Teardrops, Un(dis)Talented into farmr.club, so that instead of 4 standalone steem-based websites, we can have one grand website that "mines the human" into its awesomest version. <br/>
                  <i>When you see a great man/woman, a legend, an icon, a "true celebrity" etc you know it. You feel something. It is different. One reason is; "great men", "legends", "icons", "true celebrities" are still a rarity on Mama Earth. When we remove this rarity, we Surpass Google.</i> @surpassinggoogle <br/><br/>
                  Use this segment to "mine the human" some more. <br/>
                </p>
                <Dropdown overlay={surpassingGoogleMenu} trigger={['click']}>
                  <Button>
                    Select An Editor <Icon type="down" />
                  </Button>
                </Dropdown>
              </Collapse.Panel>
            </Collapse>

            <Card
              bordered={false}
              bodyStyle={customCardStyle}
              key="11">
              <h3 style={{color: 'purple'}}>Write A Post Related To #teardrops or #untalented?</h3>
              <p>
                Do you remember #teardrops or #untalented on Steemit? You can continue contributing "your content" under these hashtags by selecting the appropriate editor from the expandable area below.
              </p>
            </Card>

            <Collapse
              defaultActiveKey={defaultActiveKey}
              activeKey={this.state.activeKey}
              onChange={this.callback}>
              <Collapse.Panel
                header="Go To The #teardrops Editor"
                key="6"
                style={customPanelStyle}>
                <p>
                  Share your @teardrops moments. We reward "proof of  tears".<br/>
                  As you "mine the human" & en-route "breakthrough", there will be many tears, happy, sad or un-fell. "Each tear has value". We will celebrate <b>each tear</b> with a <b>"breakthrough token"</b> & <b>"emblem of human"</b> called the <b>"Teardrops Smart Media Tokens".</b> <br/>
                  Write a #teardrops post today. You may get some imaginary Teardrops SMT today, in the form of steem. Select the editor below to write a post now.<br/><br/>
                </p>
                <Button>
                  <Link to="/teardrops">Teardrops Editor</Link>
                </Button>
              </Collapse.Panel>

              <Collapse.Panel
                header="Go To The #untalented Editor"
                key="7"
                style={customPanelStyle}>
                <p>
                  We don't want any level of talent or potential talent to go amiss without celebrating it. We seek to reward  even <b>"attempts at out-of-the-boxness"</b>. <i>If we remove bum, smart or  average, "we are genius".</i><br/>
                  #untalented is a home (an important aspect of  farmr.club) where <b>"flaws are allowed".</b> When you write under #untalented, <b>"relegate reservations".</b> We will sift even the non<b>sense</b> to find <b>sense</b> therein. <br/>
                  <i>Not too confident? Confident? Too confident?</i> Write under a post now under <b>"#untalented".</b> Select the editor below!<br/><br/>
                </p>
                <Button>
                  <Link to="/untalented">Untalented Editor</Link>
                </Button>
              </Collapse.Panel>
            </Collapse>

            <Card
              bordered={false}
              bodyStyle={customCardStyle}
              key="10">
              <h3 style={{color: 'purple'}}>Write A Post?</h3>
              <p>
                On Farmr.club "your content" is queen. Whether it is a blog, ulog, or vlog, we want you to create fresh content daily. If you want to "write a post" (post to Steem) like you normally would, simply go to our general purpose editor below.
              </p>
            </Card>

            <Collapse
              defaultActiveKey={defaultActiveKey}
              activeKey={this.state.activeKey}
              onChange={this.callback}>
              <Collapse.Panel
                header="Go To The General-Purpose Editor"
                key="8"
                style={customPanelStyle}>
                <p>
                  <b>On farmr.club, your freshly-made content is queen.</b> We want to incite you create content on a daily basis as that in itself is rewarding. Anytime you invest in creating "your own content" you have managed to "mine the human" some more. This is world adjusting!<br/>
                  <b>Farmr.club allows you to explore and enjoy the entire steem ecosystem.</b> Thus, whether is it is a blog, ulog or vlog, we welcome your contributions and will look forward to celebrating <b>'the you'</b> in it; <b>we as your "true fans".</b><br/>
                  You can post to steem like you normally would (<b>e.g blogs etc</b>), using the <b>"General-Purpose" editor below.</b><br/><br/>
                </p>
                <Button>
                  <Link to="/editor">General Purpose Editor</Link>
                </Button>
              </Collapse.Panel>
            </Collapse>
          </div>
        </div>
      </div>
    );
  }
};

export default Farming;
