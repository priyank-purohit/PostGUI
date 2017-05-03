import React from 'react';
import ReactDOM from 'react-dom';

import Navigation from './components/Navigation';
import LeftPane from './components/LeftPane';
import MiddlePane from './components/MiddlePane';

import HistoryPane from './components/HistoryPane';

import './styles/index.css';

let lib = require("./utils/library.js");

export default class Layout extends React.Component {
	constructor() {
		super();
		this.state = {
			targetTable: lib.getFromConfig("noTableMsg")
		};
	}

	changeTargetTable(newTable) {
		this.setState({targetTable: newTable});
	}

	render() {
		return (
			<div>
				<Navigation />
				<LeftPane changeTargetTable={this.changeTargetTable.bind(this)} />
				<MiddlePane table={this.state.targetTable} />
				<HistoryPane />
			</div>
		);
	}
}

const app = document.getElementById('root');
ReactDOM.render(<Layout/>, app);