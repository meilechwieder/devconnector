import {
  PROFILE_ERROR,
  GET_PROFILE,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  SET_PROFILE_LOADING,
} from '../actions/types';

const initialState = {
  profile: null,
  profiles: null,
  repos: null,
  loading: false,
  errors: {},
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        loading: false,
        profile: payload,
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false,
      };
    case PROFILE_ERROR:
      return {
        ...state,
        loading: false,
        errors: payload,
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: null,
      };
    case GET_REPOS:
      return {
        ...state,
        repos: payload,
        loading: false,
      };
    case SET_PROFILE_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
