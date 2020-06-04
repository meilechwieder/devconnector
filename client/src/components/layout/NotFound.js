import React, { Fragment } from 'react';

const NotFound = (props) => {
  return (
    <Fragment>
      <h1 className='x-large text-primary'>
        <i className='fa fa-exclamation-triangle'></i> Page not found
      </h1>
      <p className='large'>Page does not exist</p>
    </Fragment>
  );
};

export default NotFound;
