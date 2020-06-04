import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getGithubRepos } from '../../actions/profile';
import Spinner from '../layout/Spinner';

const ProfileGithub = ({ getGithubRepos, username, repos }) => {
  useEffect(() => {
    getGithubRepos(username);
  }, []);
  return (
    <div className='profile-github bg-white p-2'>
      <h2 className='text-primary my-1'>Github repos</h2>
      {!repos ? (
        <Spinner />
      ) : (
        repos.map((e, i) => (
          <div>
            <div className='repo bg-white p-1 my-1' key={i}>
              <h4>
                <a href={e.html_url} target='_blank' rel='noopener noreferrer'>
                  {e.name}
                </a>
              </h4>
              <p>{e.description}</p>
            </div>
            <div>
              <ul>
                <li className='badge badge-primary'>
                  Stars: {e.stargazers_count}
                </li>
                <li className='badge badge-dark'>
                  Watchers: {e.watchers_count}
                </li>
                <li className='badge badge-light'>Forks: {e.forks_count}</li>
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

ProfileGithub.propTypes = {
  username: PropTypes.string.isRequired,
  getGithubRepos: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  repos: state.profile.repos,
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);
