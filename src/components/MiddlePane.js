import React, { Component } from 'react';
import '../styles/MiddlePane.css';
import '../styles/QueryBuilder.css';
import QueryBuilderWrapper from '../components/QueryBuilder.js';

class MiddlePane extends Component {
	render() {
		return (
			<div className="MiddlePane" id="middlePane">
				<div className="MiddlePaneInner">
					<h2>{this.props.table}</h2>
					<hr color="grey"/>
					<div id="queryBuilder" ref="queryBuilder" className="queryBuilder"></div>
					<QueryBuilderWrapper />
				</div>
			</div>
		);
	}
}

export default MiddlePane;

