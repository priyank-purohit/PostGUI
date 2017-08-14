import React from 'react';
import ReactDOM from 'react-dom';

import 'typeface-roboto';

import Navigation from './Navigation.js';
import RightPane from './RightPane.js';
import LeftPane from './LeftPane.js';

import '../styles/index.css';

//let lib = require("../utils/library.js");

export default class Layout extends React.Component {
	constructor() {
		super();
		this.state = {
			dbIndex: 0,
			table: "",
			leftPaneVisibility: true
		};
	}

	toggleLeftPane() {
		if (this.state.leftPaneVisibility) {
			this.setState({
				leftPaneVisibility: false
			});
		} else {
			this.setState({
				leftPaneVisibility: true
			});
		}
	}

	changeDbIndex(newIndex) {
		this.setState({
			dbIndex: newIndex
		});
	}

	changeTable(newTable) {
		this.setState({
			table: newTable
		});
	}

	render() {
		return (
			<div>
				<Navigation toggleLeftPane={this.toggleLeftPane.bind(this)} dbIndex={this.state.dbIndex} />
				<div className="bodyDiv">
					{this.state.leftPaneVisibility ? <LeftPane changeDbIndex={this.changeDbIndex.bind(this)} changeTable={this.changeTable.bind(this)} dbIndex={this.state.dbIndex} table={this.state.table} leftPaneVisibility={this.state.leftPaneVisibility} /> : <div></div>}
					<RightPane  dbIndex={this.state.dbIndex} table={this.state.table} leftPaneVisibility={this.state.leftPaneVisibility} />
				</div>
			</div>
		);
	}
}

const app = document.getElementById('root');
ReactDOM.render(<Layout/>, app);
