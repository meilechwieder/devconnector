import React from 'react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';

const ProfileEducation = ({
  edu: { school, degree, fieldofstudy, current, to, from, description },
}) => (
  <div>
    <h3>{school}</h3>
    <p>
      <Moment format='YYYY/MM/DD'>{from}</Moment> -{' '}
      {to ? <Moment format='YYYY/MM/DD'>{to}</Moment> : 'now'}
    </p>
    <p>
      <strong>Degree: </strong> {degree}
    </p>
    {description && (
      <p>
        <strong>Description: </strong> {description}
      </p>
    )}
    <p>
      <strong>Field of study: </strong> {fieldofstudy}
    </p>
  </div>
);

ProfileEducation.propTypes = {
  edu: PropTypes.object.isRequired,
};

export default ProfileEducation;
