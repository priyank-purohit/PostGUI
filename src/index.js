import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.js';

const app = document.getElementById('root');
let appState = {};

window.setState = (stateChange) => {
	appState = Object.assign({}, appState, stateChange);

	ReactDOM.render(<App {...appState} />, app);
};

/* eslint no-restricted-globals: 0*/
let initialState = {
	loggedIn: false,
	urlLocation: location.pathname.replace(/^\/?|\/$/g, "")
}

window.setState(initialState);
