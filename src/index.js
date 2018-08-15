import React from 'react';
import ReactDOM from 'react-dom';
import './reset.css';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { Loader } from './components/Loader'
import {store, persistor} from './store.js';

const scrollTop = function(){
  return document.body.scrollTop = document.documentElement.scrollTop = 0;
}

const CarbonCollective = (
  <BrowserRouter onUpdate={() => scrollTop()}>
    <Provider store={store}>
      <PersistGate loading={Loader} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </BrowserRouter>
)

ReactDOM.render(
  CarbonCollective, document.getElementById('root')
);
