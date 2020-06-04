import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { getPost } from '../../actions/post';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import { Link } from 'react-router-dom';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const Post = ({
  post: { post, loading },
  getPost,
  match,
  auth: { isAuthenticated },
}) => {
  useEffect(() => {
    if ((!post || match.params.post_id != post?._id) && isAuthenticated)
      getPost(match.params.post_id);
  }, [getPost, post, isAuthenticated]);

  if (!post || loading) return <Spinner />;

  return (
    <Fragment>
      <Link to='/posts' className='btn'>
        Back
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={post._id} />
      <div className='comments'></div>
      {post.comments.map((e, i) => (
        <CommentItem key={i} postId={post._id} comment={e} />
      ))}
    </Fragment>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
  auth: state.auth,
});

export default connect(mapStateToProps, { getPost })(Post);
