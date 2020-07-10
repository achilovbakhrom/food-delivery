import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Login from './login';
import Register from './register';
import Main from './main';
import 'react-notifications-component/dist/theme.css';
import ReactNotification from 'react-notifications-component';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <ReactNotification />
      <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/app" render={() => {
              if (!Cookies.get('token')) {
                  return <Redirect to="/login"/>
              } else {
                  return  <Main />
              }
          }}/>
      </Switch>
    </div>
  );
}

export default App;
