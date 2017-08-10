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
		this.state = {
			dbIndex: 0
		};
	}

	// Changes the index of DB in state + App.js state
	changeDbIndex(newIndex) {
		this.setState({
			dbIndex: newIndex
		});
		this.props.changeDbIndex(newIndex);
	}

	render() {
		const classes = this.props.classes;
		return (
			<div className={classes.root}>
				<DbPicker changeDbIndex={this.changeDbIndex.bind(this)} />
				<Divider />
				<DbSchema dbIndex={this.state.dbIndex}/>
			</div>
		);
	}
}

LeftPane.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(LeftPane);
