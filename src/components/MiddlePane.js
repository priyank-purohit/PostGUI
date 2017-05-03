import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../styles/MiddlePane.css';
import '../styles/QueryBuilder.css';
import QueryBuilderWrapper from '../components/QueryBuilder.js';

class MiddlePane extends Component {
	constructor(props) {
		super(props);
		this.state = {
			table: this.props.table, 
			columns: []
		};
	}
	
	componentDidMount() {
		var props = {table: this.state.table, columns: this.state.columns};
		ReactDOM.render(React.createElement(QueryBuilderWrapper, props), document.getElementById('qb'));
	}
	
	updateQueryBuilder(table, columns) {
		var props = {table: table, columns: columns};
		ReactDOM.render(React.createElement(QueryBuilderWrapper, props), document.getElementById('qb'));
	}

	componentWillReceiveProps(newProps) {
		this.setState({table: newProps.table, columns: newProps.columns});
		if (newProps.table && newProps.columns) {
			this.updateQueryBuilder(newProps.table, newProps.columns);
		}
	}

	render() {
		return (
			<div className="MiddlePane" id="middlePane">
				<div className="MiddlePaneInner">
					<h2>{this.state.table}</h2>
					<hr color="grey"/>
					<div id="qb" className="queryBuilder"></div>
				</div>
			</div>
		);
	}
}

export default MiddlePane;
