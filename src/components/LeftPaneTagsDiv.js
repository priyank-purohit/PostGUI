import React, { Component } from 'react';
import axios from 'axios';

class LeftPaneTagsDiv extends Component {
	constructor(props) {
		super(props);
		this.state = { rawResp: "", tables: ["Table1"] };
	}

	/*handleClick(e) {
		var buttonClicked = e.target.id;
		this.props.changeTargetTag(buttonClicked);
	}*/

	// Produces buttons for the UI
	displayTables(listOfTables = this.state.tables) {
		let ret = [];
		for (let i = 0; i < listOfTables.length; i++) {
			ret.push(<button key={i} id={i} className="tablesButtons">{listOfTables[i]}</button>);
		}
		return ret;
	}

	// Extract the names of db tables and update state
	parseTables(rawResp = this.state.rawResp) {
		let dbTables = [];
		for (let i = 0; i < rawResp.length; i++) {
			dbTables.push(rawResp[i].name);
		}
		this.setState({tables: dbTables});
	}

	// Makes a GET call to '/' to retrieve the db schema from PostgREST
	fetchDbTables(url = 'http://localhost:3001/') {
		axios.get(url, {params: {}})
			.then((response) => {
				this.setState({rawResp: response.data});
				this.parseTables(response.data);
			})
			.catch(function(error) {
				console.log(error);
			});
	}

	// Makes the API call once the basic UI has been rendered
	componentDidMount() {
		this.fetchDbTables();
	}

	render() {
		return (
			<div id="tagsDiv">
				{this.displayTables()}
			</div>
		);
	}
}

export default LeftPaneTagsDiv;
