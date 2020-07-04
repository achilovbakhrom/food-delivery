import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Login from './login';
import Register from './register';
import Main from './main';


function App() {
  return (
    <div className="App">
      <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/app" component={Main} />

      </Switch>
    </div>
  );
}

export default App;
