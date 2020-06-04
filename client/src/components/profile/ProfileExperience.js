import React from 'react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';

const ProfileExperience = ({
  exp: { company, title, location, current, to, from, description },
}) => (
  <div>
    <h3>{company}</h3>
    <p>
      <Moment format='YYYY/MM/DD'>{from}</Moment> -{' '}
      {to ? <Moment format='YYYY/MM/DD'>{to}</Moment> : 'now'}
    </p>
    <p>
      <strong>Position: </strong> {title}
    </p>
    {description && (
      <p>
        <strong>Description: </strong> {description}
      </p>
    )}
  </div>
);

ProfileExperience.propTypes = {
  exp: PropTypes.object.isRequired,
};

export default ProfileExperience;
