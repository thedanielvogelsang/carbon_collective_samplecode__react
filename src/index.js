import React from 'react';
import ReactDOM from 'react-dom';
import './reset.css';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Loader from './components/Loader';
import {store, persistor} from './store.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

library.add(faCaretRight);
library.add(faCaretDown);

const scrollTop = function(){
  return document.body.scrollTop = document.documentElement.scrollTop = 0;
}

const CarbonCollective = (
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <BrowserRouter onUpdate={scrollTop}>
          <App onUpdate={scrollTop}/>
        </BrowserRouter>
      </PersistGate>
    </Provider>
)

ReactDOM.render(
  CarbonCollective, document.getElementById('root')
);
