//function to check if there is an array of errors sent back or server error. call when error is thrown in trycatch
const dispatchErrors = (error) => (dispatch, callback) => {
  const errors = error.response.data.errors || [];
  errors.forEach((error) =>
    dispatch(
      callback(
        `${error.msg}. ${error.param ? `field: ${error.param}` : ''}`,
        'danger'
      )
    )
  );
  if (errors.length === 0) dispatch(callback(error.message, 'danger'));
};

export default dispatchErrors;
