import React, { Component } from 'react';
import '../styles/MiddlePane.css';
import '../styles/QueryBuilder.css';
import QueryBuilderWrapper from '../components/QueryBuilder.js';

import ReactDOM from 'react-dom';

var data = require('../data/data.json');

class MiddlePane extends Component {
	render() {
		return (
			<div className="MiddlePane" id="middlePane">
				<div className="MiddlePaneInner">
					<h2>{this.props.tag}</h2>
					<hr color="grey"/>
					<div id="queryBuilder" ref="queryBuilder" className="queryBuilder"></div>
					<QueryBuilderWrapper />
				</div>
			</div>
		);
	}
}

export default MiddlePane;

