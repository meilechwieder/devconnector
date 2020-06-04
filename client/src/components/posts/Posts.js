import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPosts } from '../../actions/post';
import Spinner from '../layout/Spinner';
import { useEffect } from 'react';
import PostItem from './PostItem';
import PostForm from './PostForm';

const Posts = ({
  getPosts,
  post: { posts, loading },
  auth: { isAuthenticated },
}) => {
  useEffect(() => {
    //if not logged in, there's no global header token set in axios so cant access posts yes
    if (!posts && isAuthenticated) getPosts();
  }, [getPosts, posts, isAuthenticated]);

  if (!posts) return <Spinner />;

  return (
    <Fragment>
      <PostForm />
      <div>
        <h1 className='text-large text-primary'>Posts</h1>
        <p className='lead'>
          <i className='fa fa-user'> Welcome to the community</i>
        </p>

        <div className='posts'>
          {posts.map((e, i) => (
            <PostItem key={i} post={e} />
          ))}
        </div>
      </div>
    </Fragment>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
  auth: state.auth,
});

export default connect(mapStateToProps, { getPosts })(Posts);
