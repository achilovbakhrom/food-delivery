import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from './login';
import Register from './register';
import Main from './main';
import 'react-notifications-component/dist/theme.css';
import './App.css';
import ReactNotification from 'react-notifications-component';
import Cookies from 'js-cookie';
import AdminRoot from "./admin";
import { withRouter } from 'react-router-dom';
import Forgot from './forgot';

function App(props) {

    React.useEffect(() => {
        let url;
        console.log(props.history);
        switch (props.history.location.pathname) {
            case '/app/address':
                url = `url(${require('./assets/img/bg1.jpg')})`;
                break;
            case '/app/restaurants':
                url = `url(${require('./assets/img/bg2.jpg')})`;
                break;
            case '/app/contacts':
                url = `url(${require('./assets/img/bg3.jpg')})`;
                break;
            case '/app/languages':
                url = `url(${require('./assets/img/bg4.jpg')})`;
                break;
            case '/app/profile':
                url = `url(${require('./assets/img/bg5.jpg')})`;
                break;
            case '/login':
                url = `url(${require('./assets/img/bg6.jpg')})`;
                break;
            case '/register':
                url = `url(${require('./assets/img/bg7.jpg')})`;
                break;
            case '/admin/restaurants':
                url = `url(${require('./assets/img/bg8.jpg')})`;
                break;
            case '/admin/foods':
                url = `url(${require('./assets/img/bg9.jpg')})`;
                break;
            case '/admin/menu':
                url = `url(${require('./assets/img/bg10.jpg')})`;
                break;
            default:
                break
        }
        document.getElementsByClassName('App')[0].style.backgroundImage = url;
    }, [props.history.location]);

  return (
    <div className="App">
      <ReactNotification />
      <Switch>
          <Route exact path="/" render={() => <Redirect to="/app/restaurants" />} />
          <Route path="/login" component={Login} />
          <Route path="/forgot" component={Forgot} />
          <Route path="/register" component={Register} />
          <Route path="/app" component={Main}/>
          <Route path="/admin" render={() => {
              if (!Cookies.get('token')) {
                  return <Redirect to="/login"/>
              } else {
                  return  <AdminRoot />
              }
          }}/>
      </Switch>
    </div>
  );
}

export default withRouter(App);
