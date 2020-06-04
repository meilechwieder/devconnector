import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfileById, clearProfile } from '../../actions/profile';
import { Link } from 'react-router-dom';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';

const Profile = ({
  profile: { profile: profile, loading },
  match,
  auth,
  getProfileById,
  clearProfile,
}) => {
  useEffect(() => {
    if (!profile || profile.user._id != match.params.profile_id)
      getProfileById(match.params.profile_id);
  }, [profile, getProfileById]);

  //component did unmount
  useEffect(() => {
    return () => clearProfile();
  }, []);

  if (!profile) return <Spinner />;

  return (
    <Fragment>
      <Link to='/profiles' className='btn btn-light'>
        Back
      </Link>
      {auth.isAuthenticated &&
        !auth.loading &&
        auth.user._id === profile.user._id && (
          <Link to='/edit-profile' className='btn btn-dark'>
            Edit profile
          </Link>
        )}
      <div className='profile-grid my-1'>
        <ProfileTop profile={profile} />
        <ProfileAbout profile={profile} />
        <div className='profile-exp bg-white p-2'>
          <h2 className='text-primary'>Experience</h2>
          {profile.experience.map((e, i) => (
            <ProfileExperience exp={e} key={i} />
          ))}
        </div>
        <div className='profile-edu bg-white p-2'>
          <h2 className='text-primary'>Education</h2>
          {profile.education.map((e, i) => (
            <ProfileEducation edu={e} key={i} />
          ))}
        </div>{' '}
        {profile.githubusername && (
          <ProfileGithub username={profile.githubusername} />
        )}
      </div>
    </Fragment>
  );
};

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getProfileById: PropTypes.func.isRequired,
  clearProfile: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById, clearProfile })(
  Profile
);
