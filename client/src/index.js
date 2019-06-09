import React from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import "antd/dist/antd.css";
import App from './components/App';


ReactDOM.render(<App />, document.getElementById('root'));

module.hot.accept();
