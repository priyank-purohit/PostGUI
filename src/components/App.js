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
			leftPaneVisibility: true,
			databaseIndex: 0
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

	changeDatabaseIndex(newIndex) {
		this.setState({
			databaseIndex: newIndex
		});
	}

	render() {
		return (
			<div>
				<Navigation toggleLeftPane={this.toggleLeftPane.bind(this)} databaseIndex={this.state.databaseIndex} />
				<div className="bodyDiv">
					{this.state.leftPaneVisibility ? <LeftPane changeDatabaseIndex={this.changeDatabaseIndex.bind(this)} /> : <div></div>}
					<RightPane leftPaneVisibility={this.state.leftPaneVisibility}/>
				</div>
			</div>
		);
	}
}

const app = document.getElementById('root');
ReactDOM.render(<Layout/>, app);
