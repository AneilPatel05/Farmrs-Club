import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import BTooltip from './BTooltip';
import './Story/Story.less';

function CertifiedFarmr({ intl }) {
  return (
    <BTooltip
      title={intl.formatMessage(
        { id: 'certified_farmr', defaultMessage: 'Certified Farmr' },
      )}
    >
      <img
        src="/images/certified_44.png"
        className="Story__header__certified"
      />
    </BTooltip>
  );
}

CertifiedFarmr.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(CertifiedFarmr);
