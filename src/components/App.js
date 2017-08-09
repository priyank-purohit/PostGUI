import React from 'react';
import ReactDOM from 'react-dom';

import 'typeface-roboto';

import Navigation from './Navigation.js';
import RightPane from './RightPane.js';
import LeftPane from './LeftPane.js';

import '../styles/index.css';

let lib = require("../utils/library.js");

export default class Layout extends React.Component {
	constructor() {
		super();
		this.state = {
			targetTable: lib.getFromConfig("noTableMsg"),
			targetTableColumns: [],
			selectTableColumns: []
		};
	}

	toggleLeftPane() {
		console.log("Closing left pane.");
	}

	render() {
		return (
			<div>
				<Navigation toggleLeftPane={this.toggleLeftPane.bind(this)} />
				<div className="bodyDiv">
					<LeftPane />
					<RightPane />
				</div>
			</div>
		);
	}
}

const app = document.getElementById('root');
ReactDOM.render(<Layout/>, app);
