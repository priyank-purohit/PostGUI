import React, { Component } from 'react';
import '../styles/MiddlePane.css';

var data = require('../data/data.json');

class MiddlePane extends Component {
	render() {
		return (
			<div className="MiddlePane">
				<div className="MiddlePaneInner">
					<h2>{this.props.tag}</h2>
				</div>
			</div>
		);
	}
}

export default MiddlePane;
