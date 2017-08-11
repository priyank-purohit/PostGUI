import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Divider from 'material-ui/Divider';
import DbPicker from './DbPicker.js'
import DbSchema from './DbSchema.js'

const styleSheet = createStyleSheet({
	root: {
		width: '29%',
		height: '100%',
		float: 'left',
	},
	column: {
		marginLeft: 27
	}
});

class LeftPane extends Component {
	constructor(props) {
		super(props);
		console.log("Left pane reconstructed.....");
		this.state = {
			dbIndex: props.dbIndex,
			table: props.table,
			leftPaneVisibility: props.leftPaneVisibility
		};
	}

	// Changes the index of DB in state + App.js state
	changeDbIndex(newIndex) {
		this.props.changeDbIndex(newIndex);
		this.setState({
			dbIndex: newIndex
		});
	}


	// Changes the index of DB in state + App.js state
	changeTable(newTable) {
		this.props.changeTable(newTable);
		this.setState({
			table: newTable
		});
	}

	render() {
		const classes = this.props.classes;
		return (
			<div className={classes.root}>
				<div>
					<p><b>LeftPane.js state</b></p>
					<p>left, db, table = {this.state.leftPaneVisibility.toString()} {this.state.dbIndex} {this.state.table}</p>
				</div>

				<DbPicker changeDbIndex={this.changeDbIndex.bind(this)} dbIndex={this.state.dbIndex} table={this.state.table} leftPaneVisibility={this.state.leftPaneVisibility} />
				<Divider />
				<DbSchema changeTable={this.changeTable.bind(this)} dbIndex={this.state.dbIndex} table={this.state.table} leftPaneVisibility={this.state.leftPaneVisibility} />
			</div>
		);
	}
}

LeftPane.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(LeftPane);
