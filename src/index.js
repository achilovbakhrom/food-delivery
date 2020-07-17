import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {green, indigo, red} from "@material-ui/core/colors";
import { BrowserRouter } from 'react-router-dom';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18';

const theme = createMuiTheme({

    palette: {
        type: 'dark',
        primary: {
            main: red.A700,
            dark: indigo
        },
        secondary: {
            main: '#d63d3d',
        },
    },

    overrides: {
        MuiButton: {
            contained: {
                backgroundColor: red.A700,
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
              <I18nextProvider i18n={i18n}>
                  <App />
              </I18nextProvider>
          </BrowserRouter>
      </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
