import React, { Component } from 'react';
import '../styles/MiddlePane.css';
import '../styles/QueryBuilder.css';
import $ from 'jquery';

var data = require('../data/data.json');

class MiddlePane extends Component {
	render() {
		return (
			<div className="MiddlePane" id="middlePane">
				<div className="MiddlePaneInner">
					<div id="queryBuilder" className="queryBuilder">
					</div>
				</div>
			</div>
		);
	}
}

export default MiddlePane;
