import axios from 'axios';
import { setAlert } from './alert';
import dispatchErrors from '../utils/dispatchErrors';
import {
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  ACCOUNT_DELETED,
  CLEAR_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  SET_PROFILE_LOADING,
} from './types';

export const getCurrentProfile = () => async (dispatch) => {
  dispatch({ type: SET_PROFILE_LOADING });
  try {
    const res = await axios.get('/api/profile/me');
    dispatch({ type: GET_PROFILE, payload: res.data.data });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response?.data.errors || error.response?.statusText,
        status: error.response?.status,
      },
    });
  }
};

//get all profiles
export const getProfiles = () => async (dispatch) => {
  dispatch({ type: SET_PROFILE_LOADING });

  dispatch({ type: CLEAR_PROFILE });
  try {
    const res = await axios.get('/api/profile');
    dispatch({ type: GET_PROFILES, payload: res.data.data });
    console.log(res.data);
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.data.errors || error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

//get all github repos
export const getGithubRepos = (githubUsername) => async (dispatch) => {
  dispatch({ type: SET_PROFILE_LOADING });

  try {
    const res = await axios.get(`/api/github/${githubUsername}`);
    dispatch({ type: GET_REPOS, payload: res.data.data });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.data.errors || error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

//get all profile by id
export const getProfileById = (userId) => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: SET_PROFILE_LOADING });

  try {
    const res = await axios.get(`/api/profile/user/${userId}`);
    dispatch({ type: GET_PROFILE, payload: res.data.data });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response?.data.errors || error.response?.statusText,
        status: error.response?.status,
      },
    });
  }
};

//create or update
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  dispatch({ type: SET_PROFILE_LOADING });

  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.post('/api/profile', formData, config);
    dispatch({ type: GET_PROFILE, payload: res.data.data });
    dispatch(setAlert(edit ? 'Profile updated' : 'Profile Created', 'success'));
    if (!edit) {
      history.push('/dashboard');
    }
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.data.errors || error.response.statusText,
        status: error.response.status,
      },
    });
    dispatchErrors(error)(dispatch, setAlert);
  }
};

//add experience
export const addExperience = (formData, history) => async (dispatch) => {
  dispatch({ type: SET_PROFILE_LOADING });

  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.put('/api/profile/experience', formData, config);
    dispatch({ type: UPDATE_PROFILE, payload: res.data.data });
    dispatch(setAlert('Experience added', 'success'));
    history.push('/dashboard');
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.data.errors || error.response.statusText,
        status: error.response.status,
      },
    });
    dispatchErrors(error)(dispatch, setAlert);
  }
};

//add education
export const addEducation = (formData, history) => async (dispatch) => {
  dispatch({ type: SET_PROFILE_LOADING });

  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.put('/api/profile/education', formData, config);
    dispatch({ type: UPDATE_PROFILE, payload: res.data.data });
    dispatch(setAlert('Education added', 'success'));
    history.push('/dashboard');
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.data.errors || error.response.statusText,
        status: error.response.status,
      },
    });
    dispatchErrors(error)(dispatch, setAlert);
  }
};

//delete experience
export const deleteExperience = (id) => async (dispatch) => {
  dispatch({ type: SET_PROFILE_LOADING });

  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);
    dispatch({ type: UPDATE_PROFILE, payload: res.data.data });
    dispatch(setAlert('Experience removed', 'success'));
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.data.errors || error.response.statusText,
        status: error.response.status,
      },
    });
    dispatchErrors(error)(dispatch, setAlert);
  }
};

//delete education
export const deleteEducation = (id) => async (dispatch) => {
  dispatch({ type: SET_PROFILE_LOADING });

  try {
    const res = await axios.delete(`/api/profile/education/${id}`);
    dispatch({ type: UPDATE_PROFILE, payload: res.data.data });
    dispatch(setAlert('Education removed', 'success'));
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.data.errors || error.response.statusText,
        status: error.response.status,
      },
    });
    dispatchErrors(error)(dispatch, setAlert);
  }
};

//delete account
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure? this can NOT be undone')) {
    dispatch({ type: SET_PROFILE_LOADING });

    try {
      await axios.delete(`/api/profile`);
      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });
      dispatch(setAlert('Your account is permanently deleted', 'success'));
    } catch (error) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: error.response.data.errors || error.response.statusText,
          status: error.response.status,
        },
      });
      dispatchErrors(error)(dispatch, setAlert);
    }
  }
};

export const clearProfile = () => (dispatch) =>
  dispatch({ type: CLEAR_PROFILE });
