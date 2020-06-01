import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  CLEAR_PROFILE,
  LOG_OUT,
} from './types';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';
import dispatchErrors from '../utils/dispatchErrors';
import { getCurrentProfile } from './profile';

export const loadUser = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  setAuthToken(token);
  try {
    const res = await axios.get('/api/auth');
    dispatch({ type: USER_LOADED, payload: res.data.data });
  } catch (error) {
    dispatch({ type: AUTH_ERROR });
  }
};

export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('/api/users', body, config);

    if (res.data.success) {
      dispatch({ type: REGISTER_SUCCESS, payload: res.data.data });
      dispatch(setAlert('Register success', 'success'));
      dispatch(loadUser());
      dispatch(getCurrentProfile());
    }
  } catch (error) {
    dispatchErrors(error)(dispatch, setAlert);
    dispatch({ type: REGISTER_FAIL });
  }
};

export const login = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);

    if (res.data.success) {
      console.log(res);
      dispatch({ type: LOGIN_SUCCESS, payload: res.data.data });
      dispatch(setAlert('Login success', 'success'));
      dispatch(loadUser());
      dispatch(getCurrentProfile());
    }
  } catch (error) {
    dispatchErrors(error)(dispatch, setAlert);
    dispatch({ type: LOGIN_FAIL });
  }
};

export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOG_OUT });
  dispatch(setAlert('Logout success', 'success'));
};
