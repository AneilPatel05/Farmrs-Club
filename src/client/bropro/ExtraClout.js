import React from 'react';
import Brocard from './Brocard';
import Notification from './Notification';
import './bropro.css';

class ExtraClout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNotification: false,
    };
    this.showNotification = this.showNotification.bind(this);
    this.handleNotificationchange = this.handleNotificationchange.bind(this);
  }

  showNotification() {
    this.setState({
      showNotification: true,
    });
  }

  handleNotificationchange() {
    this.setState({
      showNotification: false,
    });
  }

  render() {
    const notificationActionlinkProps = {
      href: 'https://steem-engine.com/?p=market&t=TEARDROPS',
      title: 'To the market',
      text: 'Go to Market',
    };
    return (
      <div className="shifted" style={{ margin: 0 }}>
        <Notification
          heading="Buying Details"
          text="To get this experience all you need to do is send teardrops to the user you wish to utilise with memo &quote;bropro&quote; via steem-engine.com. If you don't have the specified teardrops amount, you can use the button below to access the market to buy teardrops. If you have any questions or concerns, all our BroPro members are available on our Discord to help with your queries."
          actionlink={notificationActionlinkProps}
          showNotification={this.state.showNotification}
          handleChange={this.handleNotificationchange}
        />
        <div className="banner">
          <div className="innerWrapper">
            <h3>How About Extra Clout On Steem Or Outside Steem</h3>
            <p>
              You are a celebrity and we are your fan. As we continue to grow our network of
              &#39;certified farmrs&#39;, we may find some who have social influence whether on
              steem or outside steem. Extra clout goes a long way in creating awareness for your
              projects, dreams or you. Clout can take different forms too e.g a certified ulogger
              with some 1.7 million YouTube subscribers may be willing to give your product a
              shoutout on one of his viral videos etc.
            </p>
            <p>
              Check out our list to find out what our &#39;certified farmrs&#39; have in stock for
              you.
            </p>
          </div>
        </div>
        <div className="container">
          <div className="center" style={{ marginTop: '50px' }}>
            <h3>Certified farmrs</h3>
            <div className="broproCards">
              <Brocard
                name="surpassinggoogle"
                text="I will provide a 30 min chat session (audio or video) about community/project development and general success."
                price="100"
                onButtonclick={this.showNotification}
              />
              <Brocard
                name="tobias-g"
                text="I provide a 30 min chat session (audio) to help you design your application UI and provide you guidance surrounding developing your steem front end."
                price="500"
                onButtonclick={this.showNotification}
              />
              <Brocard
                name="ankarlie"
                text="I will provide a 30 min chat session teaching you about viable crypto investments. We will cover trading, blockchain, free/paid investments, etc."
                price="100"
                onButtonclick={this.showNotification}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ExtraClout;
