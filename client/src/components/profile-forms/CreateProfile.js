import React, { useState, Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createProfile, getCurrentProfile } from '../../actions/profile';
import { Link, withRouter } from 'react-router-dom';
import Spinner from '../layout/Spinner';

const CreateProfile = ({
  getCurrentProfile,
  createProfile,
  history,
  profile: { profile, loading },
}) => {
  useEffect(() => {
    if (!profile) getCurrentProfile();
    if (!loading && profile) {
      setFormData({
        company: profile.company ? profile.company : '',
        location: profile.location ? profile.location : '',
        website: profile.website ? profile.website : '',
        bio: profile.bio ? profile.bio : '',
        skills: profile.skills ? profile.skills : '',
        status: profile.status ? profile.status : '',
        githubusername: profile.githubusername ? profile.githubusername : '',
      });
      if (profile.social) {
        setFormData({
          youtube: profile.social.youtube ? profile.social.youtube : '',
          twitter: profile.social.twitter ? profile.social.twitter : '',
          instagram: profile.social.instagram ? profile.social.instagram : '',
          linkedin: profile.social.linkedin ? profile.social.linkedin : '',
          facebook: profile.social.facebook ? profile.social.facebook : '',
        });
      }
    }
  }, [loading, getCurrentProfile, profile]);

  const edit = profile ? true : false;

  const [formData, setFormData] = useState({
    company: '',
    location: '',
    website: '',
    bio: '',
    skills: '',
    status: '',
    githubusername: '',
    youtube: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    facebook: '',
  });

  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    company,
    location,
    website,
    bio,
    skills,
    status,
    githubusername,
    youtube,
    twitter,
    instagram,
    linkedin,
    facebook,
  } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      createProfile(formData, history, edit);
    }, 1500);
  };

  if (isSubmitting || (loading && profile)) return <Spinner />;

  return (
    <Fragment>
      <div style={{ opacity: isSubmitting ? 0.5 : 1 }}>
        <h1 className='large text-primary'>
          {edit ? 'Edith' : 'Create'} Your Profile
        </h1>
        <p className='lead'>
          <i className='fa fa-user'></i> Let's get some information to make your
          profile stand out
        </p>
        <small>* = required field</small>
        <form className='form' onSubmit={onSubmit}>
          <div className='form-group'>
            <select name='status' value={status} onChange={(e) => onChange(e)}>
              <option value='0'>* Select Professional Status</option>
              <option value='Developer'>Developer</option>
              <option value='Junior Developer'>Junior Developer</option>
              <option value='Senior Developer'>Senior Developer</option>
              <option value='Manager'>Manager</option>
              <option value='Student or Learning'>Student or Learning</option>
              <option value='Instructor'>Instructor or Teacher</option>
              <option value='Intern'>Intern</option>
              <option value='Other'>Other</option>
            </select>
            <small className='form-text'>
              Give us an idea of where you are at in your career
            </small>
          </div>
          <div className='form-group'>
            <input
              type='text'
              placeholder='Company'
              name='company'
              value={company}
              onChange={onChange}
            />
            <small className='form-text'>
              Could be your own company or one you work for
            </small>
          </div>
          <div className='form-group'>
            <input
              type='url'
              placeholder='Website'
              name='website'
              value={website}
              onChange={onChange}
            />
            <small className='form-text'>
              Could be your own or a company website
            </small>
          </div>
          <div className='form-group'>
            <input
              type='text'
              placeholder='Location'
              name='location'
              value={location}
              onChange={onChange}
            />
            <small className='form-text'>
              City & state suggested (eg. Boston, MA)
            </small>
          </div>
          <div className='form-group'>
            <input
              type='text'
              placeholder='* Skills'
              name='skills'
              value={skills}
              onChange={onChange}
            />
            <small className='form-text'>
              Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
            </small>
          </div>
          <div className='form-group'>
            <input
              type='text'
              placeholder='Github Username'
              name='githubusername'
              value={githubusername}
              onChange={onChange}
            />
            <small className='form-text'>
              If you want your latest repos and a Github link, include your
              username
            </small>
          </div>
          <div className='form-group'>
            <textarea
              placeholder='A short bio of yourself'
              name='bio'
              value={bio}
              onChange={onChange}
            ></textarea>
            <small className='form-text'>Tell us a little about yourself</small>
          </div>

          <div className='my-2'>
            <button
              type='button'
              className='btn btn-light'
              onClick={() => toggleSocialInputs(!displaySocialInputs)}
            >
              Add Social Network Links
            </button>
            <span>Optional</span>
          </div>
          {displaySocialInputs && (
            <Fragment>
              <div className='form-group social-input'>
                <i className='fa fa-twitter fa-2x'></i>
                <input
                  type='url'
                  placeholder='Twitter URL'
                  name='twitter'
                  value={twitter}
                  onChange={onChange}
                />
              </div>

              <div className='form-group social-input'>
                <i className='fa fa-facebook fa-2x'></i>
                <input
                  type='url'
                  placeholder='Facebook URL'
                  name='facebook'
                  value={facebook}
                  onChange={onChange}
                />
              </div>

              <div className='form-group social-input'>
                <i className='fa fa-youtube fa-2x'></i>
                <input
                  type='url'
                  placeholder='YouTube URL'
                  name='youtube'
                  value={youtube}
                  onChange={onChange}
                />
              </div>

              <div className='form-group social-input'>
                <i className='fa fa-linkedin fa-2x'></i>
                <input
                  type='url'
                  placeholder='Linkedin URL'
                  name='linkedin'
                  value={linkedin}
                  onChange={onChange}
                />
              </div>

              <div className='form-group social-input'>
                <i className='fa fa-instagram fa-2x'></i>
                <input
                  type='url'
                  placeholder='Instagram URL'
                  name='instagram'
                  value={instagram}
                  onChange={onChange}
                />
              </div>
            </Fragment>
          )}

          <input type='submit' className='btn btn-primary my-1' />
          <Link className='btn btn-light my-1' to='/dashboard'>
            Go Back
          </Link>
        </form>
      </div>
    </Fragment>
  );
};

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  withRouter(CreateProfile)
);
