import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import DiscoverUser from './DiscoverUser';
import Loading from '../components/Icon/Loading';
import steemAPI from '../steemAPI';

@withRouter
class DiscoverFarmrs extends React.Component {
  static propTypes = {
    authenticatedUser: PropTypes.shape({
      name: PropTypes.string,
    }),
    match: PropTypes.shape().isRequired,
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
      <div>
        {users.map(user => <DiscoverUser key={user.name} user={user} />)}
      </div>
    );
  }
}

export default DiscoverFarmrs;
