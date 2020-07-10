import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {green, indigo} from "@material-ui/core/colors";
import { BrowserRouter } from 'react-router-dom';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: green.A700,
            dark: indigo
        },
        secondary: {
            main: '#d63d3d',
        },

    },

    overrides: {
        MuiButton: {
            contained: {
                backgroundColor: green.A700,
                color: 'white',

            }


        },
        MuiInputBase: {
            root: {
                backgroundColor: '#ffffff33'
            }

        }
    },

    typography: {
        useNextVariants: true
    }
});

ReactDOM.render(
  <React.StrictMode>
      <MuiThemeProvider theme={theme}>
          <BrowserRouter>
              <App />
          </BrowserRouter>
      </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
