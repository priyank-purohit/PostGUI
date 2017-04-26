import React, { Component } from 'react';
import '../styles/MiddlePane.css';

var data = require('../data/data.json');

class MiddlePane extends Component {
	render() {
		return (
			<div className="MiddlePane">
				<div className="MiddlePaneInner">
					<p>{this.props.tag}</p>
				</div>
			</div>
		);
	}
}

export default MiddlePane;
