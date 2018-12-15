import React from 'react';
import ReactDOM from 'react-dom';
import Appy from './App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter} from 'react-router-dom';
import './index.css';
//require('dotenv').config()


const App = () => (
  <MuiThemeProvider>
    <Appy />
  </MuiThemeProvider>
);



ReactDOM.render(<BrowserRouter><App/></BrowserRouter>, document.getElementById('root'));
registerServiceWorker();