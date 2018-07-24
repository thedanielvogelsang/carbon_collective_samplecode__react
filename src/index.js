import React from 'react';
import ReactDOM from 'react-dom';
import './reset.css';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';

const scrollTop = function(){
  return document.body.scrollTop = document.documentElement.scrollTop = 0;
}
const CarbonCollective = (
  <BrowserRouter onUpdate={() => scrollTop()}>
    <App />
  </BrowserRouter>
)

ReactDOM.render(
  CarbonCollective, document.getElementById('root')
);
