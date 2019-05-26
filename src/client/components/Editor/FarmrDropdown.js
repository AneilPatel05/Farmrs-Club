import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Icon, Menu, Dropdown } from 'antd';
import { injectIntl } from 'react-intl';

const menu = (
  <Menu>
    <Menu.Item key="10">
      <Link to={'/farmr-knowledge-bank'}>FARMR-Knowledge-Bank</Link>
    </Menu.Item>
    <Menu.Item key="11">
      <Link to={'/farmr-fanlove'}>FARMR-Fan Love</Link>
    </Menu.Item>
    <Menu.Item key="12">
      <Link to={'/surpassinggoogle'}>SurpassingGoogle</Link>
    </Menu.Item>
  </Menu>
);

const FarmrDropdown = ({ intl }) => (
  <Dropdown overlay={menu} trigger={['click']}>
    <a className="ant-dropdown-link" href="#">
      Try More #farming? <Icon type="down" />
    </a>
  </Dropdown>
);

FarmrDropdown.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(FarmrDropdown);