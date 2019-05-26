import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Collapse } from 'antd';
import _ from 'lodash';
import User from './User';
import Loading from '../../components/Icon/Loading';
import steemAPI from '../../steemAPI';
import './InterestingPeople.less';
import './SidebarContentBlock.less';

@withRouter
class InterestingFarmrsWithAPI extends React.Component {
  static propTypes = {
    isFetchingFollowingList: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    authenticatedUser: {
      name: '',
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      users: [],
      userNames: [],
      loading: true,
      noUsers: false,
    };

    this.getCertifiedFarmrs = this.getCertifiedFarmrs.bind(this);
  }

  componentDidMount() {
    if (!this.props.isFetchingFollowingList) {
      this.getCertifiedFarmrs();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isFetchingFollowingList) {
      this.getCertifiedFarmrs();
    }
  }

  getCertifiedFarmrs() {
    steemAPI
      .sendAsync('call', ['condenser_api', 'get_following', ['farmrs', '', 'blog', 100]])
      .then(result => {
        const userNames = _.sortBy(result, 'following')
          .map(user => {
            let name = _.get(user, 0);

            if (_.isEmpty(name)) {
              name = _.get(user, 'following');
            }
            return {
              name,
            };
          });
        if (userNames.length > 0) {
          this.setState({
            userNames,
          });
        } else {
          this.setState({
            noUsers: true,
          });
        }
      })
      .then(() => {
        const farmrs = this.state.userNames.map(user => {
            return user.name;
          });
        steemAPI.sendAsync('get_accounts', [farmrs]).then(users =>
          this.setState({
            users,
            loading: false,
            noUsers: false,
          })
        );
     })
     .catch(() => {
        this.setState({
          noUsers: true,
        });
      });
  }

  render() {
    const { users, loading, noUsers } = this.state;

    if (noUsers) {
      return <div />;
    }

    if (loading) {
      return <Loading />;
    }

    return (
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel
          header={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <i className="iconfont icon-group SidebarContentBlock__icon" />{' '}
              <FormattedMessage id="interesting_farmrs" defaultMessage="Interesting Farmrs" />
              <button
                onClick={this.getCertifiedFarmrs}
                className="InterestingPeople__button-refresh"
              >
                <i
                  className="iconfont icon-refresh"
                  style={{
                    marginRight: 15,
                  }}
                />
              </button>
            </div>
          }
          key="1"
        >
          <div
            className="SidebarContentBlock__content"
            style={{ textAlign: 'center', overflowY: 'auto', height: '300px', paddingLeft: 0 }}
          >
            {users && users.map(user => <User key={user.name} user={user} />)}
            <h4 className="InterestingPeople__more">
              <Link to={'/discover'}>
                <FormattedMessage
                  id="discover_more_people"
                  defaultMessage="Discover More Farmrs"
                />
              </Link>
            </h4>
          </div>
        </Collapse.Panel>
      </Collapse>
    );
  }
}

export default InterestingFarmrsWithAPI;
