import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfiles } from '../../actions/profile';

const Profiles = ({ profile: { profiles, loading }, getProfiles }) => {
  useEffect(
    () => {
      getProfiles();
    },
    //eslint-disable-next-line
    []
  );


return <Fragment>{loading ? <Spinner/> : (
    <Fragment>
        <h1 className="large text-primary">Developers</h1>
        <p className="lead">
            <i className="fa fa-connect-develop"></i>
            {' '}Browse and connect with developers
        </p>
        <div className="profiles">
            {profiles.length > 0 ? profiles.map(profile => (
                null
            )): (<h4>No profiles found</h4>)}
        </div>
    </Fragment>
)}</Fragment>;
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
