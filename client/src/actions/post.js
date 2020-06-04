import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_POSTS,
  GET_POST,
  POST_ERROR,
  UPDATE_LIKES,
  ADD_POST,
  DELETE_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
} from './types';
import dispatchErrors from '../utils/dispatchErrors';

export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/posts');
    if (!res.data.errors) {
      dispatch({ type: GET_POSTS, payload: res.data.data });
    } else {
      throw res.data.errors;
    }
  } catch (error) {
    console.error(error);
    dispatchErrors(error)(dispatch, setAlert);
    dispatch({ type: POST_ERROR });
  }
};

export const addLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.put('/api/posts/like/' + postId);
    if (!res.data.errors) {
      dispatch({
        type: UPDATE_LIKES,
        payload: { postId, likes: res.data.data },
      });
    } else {
      throw res.data.errors;
    }
  } catch (error) {
    console.error(error);
    dispatchErrors(error)(dispatch, setAlert);
    dispatch({ type: POST_ERROR });
  }
};

export const removeLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.put('/api/posts/unlike/' + postId);
    if (!res.data.errors) {
      dispatch({
        type: UPDATE_LIKES,
        payload: { postId, likes: res.data.data },
      });
    } else {
      throw res.data.errors;
    }
  } catch (error) {
    console.error(error);
    dispatchErrors(error)(dispatch, setAlert);
    dispatch({ type: POST_ERROR });
  }
};

export const addPost = (data) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axios.post('/api/posts', data, config);
    if (res.data.success) {
      dispatch({ type: ADD_POST, payload: res.data.data });
      dispatch(setAlert('Post added', 'success'));
    } else {
      console.log('hello', res.data);
    }
  } catch (error) {
    console.error(error);
    dispatchErrors(error)(dispatch, setAlert);
    dispatch({ type: POST_ERROR });
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    await axios.delete('api/posts/' + id);

    dispatch({ type: DELETE_POST, payload: id });
    dispatch(setAlert('Post deleted', 'success'));
  } catch (error) {
    console.error(error);
    dispatchErrors(error)(dispatch, setAlert);
    dispatch({ type: POST_ERROR });
  }
};

export const getPost = (id) => async (dispatch) => {
  try {
    const res = await axios.get('/api/posts/' + id);
    if (!res.data.errors) {
      dispatch({ type: GET_POST, payload: res.data.data });
    } else {
      throw res.data.errors;
    }
  } catch (error) {
    console.error(error);
    dispatchErrors(error)(dispatch, setAlert);
    dispatch({ type: POST_ERROR });
  }
};

export const addComment = (postId, data) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axios.post('/api/posts/comments/' + postId, data, config);
    if (res.data.success) {
      dispatch({
        type: ADD_COMMENT,
        payload: { postId, comments: res.data.data },
      });
      dispatch(setAlert('Comment added', 'success'));
    }
  } catch (error) {
    console.error(error);
    dispatchErrors(error)(dispatch, setAlert);
    dispatch({ type: POST_ERROR });
  }
};

export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    await axios.delete('/api/posts/comments/' + postId + '/' + commentId);

    dispatch({ type: REMOVE_COMMENT, payload: { commentId, postId } });
    dispatch(setAlert('Comment deleted', 'success'));
  } catch (error) {
    console.error(error);
    dispatchErrors(error)(dispatch, setAlert);
    dispatch({ type: POST_ERROR });
  }
};
