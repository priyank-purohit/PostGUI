import React, { Component } from 'react';
import axios from 'axios';

var data = require('../data/data.json');
var lib = require('../utils/library.js');

class LeftPaneTagsDiv extends Component {
	constructor(props) {
		super(props);

		this.state = { tables: [] };
	}

	handleClick(e) {
		var buttonClicked = e.target.id;
		this.props.changeTargetTag(buttonClicked);
	}

	getKeysFromJSON(jsonDataStr) {
		var keys = [];
		for (var k in jsonDataStr) {
			keys.push(<button key={k} id={k} className="tagsButton" onClick={this.handleClick.bind(this)}>{k}</button>);
			keys.push(<br key={k+1}/>);
		}
		return keys;
	}

	fetchDbTables(url = 'http://localhost:3001/') {
		axios.get(url, {
				params: {
					ID: 12345
				}
			})
			.then(function(response) {
				console.log("le resp = " + JSON.stringify(response.data));
				// TO DO : parse the response.data to produce a list of tables...
			})
			.catch(function(error) {
				console.log(error);
			});
	}

	render() {
		return (
			<div id="tagsDiv">
				{this.fetchDbTables()}
			</div>
		);
	}
}

export default LeftPaneTagsDiv;
