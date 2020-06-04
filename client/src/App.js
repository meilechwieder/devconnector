import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import './App.css';
import Alert from './components/layout/Alert';
import { getCurrentProfile } from './actions/profile';
import { loadUser } from './actions/auth';
import CreateProfile from './components/profile-forms/CreateProfile';
//redux
import { Provider } from 'react-redux';
import store from './store';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
    //prettier-ignore
    const state = store.getState().profile
    //check if its not loading. if it is, do not request current profile because maybe he went directly someone profile page and its loading cause its in the middle of getting that profile already
    if (!state.loading && !state.profile) store.dispatch(getCurrentProfile());
    //eslint-disable-next-line
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <Route exact path='/profiles' component={Profiles} />
          <Route exact path='/profile/:profile_id' component={Profile} />
          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path='/register' component={Register} />
              <PrivateRoute
                exact
                path='/dashboard'
                to={'/login'}
                component={Dashboard}
              />
              <PrivateRoute
                exact
                path='/create-profile'
                to={'/login'}
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path='/add-experience'
                to={'/login'}
                component={AddExperience}
              />
              <PrivateRoute
                exact
                path='/add-education'
                to={'/login'}
                component={AddEducation}
              />
              <PrivateRoute
                exact
                path='/posts'
                to={'/login'}
                component={Posts}
              />
              <PrivateRoute
                exact
                path='/posts/:post_id'
                to={'/login'}
                component={Post}
              />
              <Route exact path='/login' component={Login} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
