import React, { Component } from 'react';
import '../styles/Navigation.css';


var lib = require('../utils/library.js');

class Navigation extends Component {
	render() {
		return (
			<div className="navigation">
				<p className="navigationElement">Home</p>
				<p className="navigationElement">Custom Query</p>
				<p className="navigationElement">Data Visualization</p>
			</div>
		);
	}
}

export default Navigation;
