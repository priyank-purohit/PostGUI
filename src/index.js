import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.js';

export default class Layout extends React.Component {
	render() {
		return (
			<App />
		);
	}
}

const app = document.getElementById('root');
ReactDOM.render(<Layout/>, app);
