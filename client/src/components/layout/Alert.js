import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alerts }) => (
  <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 8888 }}>
    {alerts !== null &&
      alerts.length > 0 &&
      alerts.map((alert) => (
        <div key={alert.id} className={`alert alert-${alert.type}`}>
          {alert.msg}
        </div>
      ))}
  </div>
);

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
