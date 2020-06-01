import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { Link } from 'react-router-dom';
import DashboardAction from './DashboardActions';
import Experience from './Experiences';
import Education from './Educations';
import { deleteAccount } from '../../actions/profile';

const Dashboard = ({
  deleteAccount,
  auth: { user },
  profile: { profile, loading },
}) => {
  return (loading && profile === null) || !user ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fa fa-user'></i> Welcome {user.name}
      </p>
      {profile ? (
        <Fragment>
          <DashboardAction />
          <Experience experience={profile.experience} />
          <Education education={profile.education} />
          <div className='my-2'>
            <button
              type='button'
              className='btn btn-danger'
              onClick={deleteAccount}
            >
              <i className='fa fa-user-minus'></i> Delete My Account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>
            You have not yet set up a profile. Please add some info about
            yourself
          </p>
          <Link className='btn btn-primary my-1' to='/create-profile'>
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});
export default connect(mapStateToProps, { deleteAccount })(Dashboard);
