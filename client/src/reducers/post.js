import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  ADD_POST,
  DELETE_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
} from '../actions/types';

const initialState = {
  posts: null,
  post: null,
  loading: true,
  error: null,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false,
      };
    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false,
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
        loading: false,
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((e) => e._id !== payload),
        loading: false,
      };
    case ADD_COMMENT:
      return {
        ...state,
        loading: false,
        post: { ...state.post, comments: payload.comments },
        posts: state.posts
          ? state.posts.map((e) =>
              e._id === payload.postId
                ? { ...e, comments: payload.comments }
                : e
            )
          : null,
      };
    case REMOVE_COMMENT:
      return {
        ...state,
        loading: false,
        post: {
          ...state.post,
          comments: state.post.comments.filter(
            (e) => e._id !== payload.commentId
          ),
        },
        posts: state.posts
          ? state.posts.map((e) =>
              e._id === payload.postId
                ? {
                    ...e,
                    comments: e.comments.filter(
                      (e) => e._id !== payload.commentId
                    ),
                  }
                : e
            )
          : null,
      };
    case UPDATE_LIKES:
      return {
        ...state,
        loading: false,
        posts: state.posts.map((e) =>
          e._id === payload.postId ? { ...e, likes: payload.likes } : e
        ),
      };
    default:
      return state;
  }
}
