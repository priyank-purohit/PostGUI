import React, { Component } from 'react';
import axios from 'axios';

class LeftPaneTagsDiv extends Component {
	constructor(props) {
		super(props);

		this.state = { raw_resp: "", tables: ["Table1"] };

		//this.fetchDbTables = this.fetchDbTables.bind(this);
	}

	/*handleClick(e) {
		var buttonClicked = e.target.id;
		this.props.changeTargetTag(buttonClicked);
	}*/

	parseTables() {
		console.log("This was done...");
		let db_tables = this.state.raw_resp;
		for (var i = 0; i < db_tables.length; i++) {
			console.log(db_tables[i].name);
			this.state.tables.push(db_tables[i].name);
		}
	}

	fetchDbTables(url = 'http://localhost:3001/') {
		axios.get(url, {params: {}})
			.then((response) => {
				this.setState({raw_resp: response.data});
				this.parseTables();
			})
			.catch(function(error) {
				console.log(error);
			});
	}

	componentDidMount() {
		this.fetchDbTables();
	}

	render() {
		return (
			<div id="tagsDiv">
				{this.state.tables}				
			</div>
		);
	}
}

export default LeftPaneTagsDiv;
