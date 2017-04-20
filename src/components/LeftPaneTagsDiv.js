import React, { Component } from 'react';

var data = require('../data/data.json');
var lib = require('../utils/library.js');

class LeftPaneTagsDiv extends Component {
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

	render() {
		return (
			<div id="tagsDiv">
				{this.getKeysFromJSON(data)}
			</div>
		);
	}
}

export default LeftPaneTagsDiv;
