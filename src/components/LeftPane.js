import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Divider from 'material-ui/Divider';
import DbPicker from './DbPicker.js'
import DbSchema from './DbSchema.js'


class LeftPane extends Component {
	constructor(props) {
		super(props);
	}


	render() {
		const classes = this.props.classes;
		let rootClasses = this.props.leftPaneVisibility === true ? classes.root : classes.rootHide;
		return (
			<div className={rootClasses}>
				<DbPicker changeDbIndex={this.props.changeDbIndex} dbIndex={this.props.dbIndex} table={this.props.table} leftPaneVisibility={this.props.leftPaneVisibility} />
				<Divider />
				<DbSchema changeTable={this.props.changeTable} changeColumns={this.props.changeColumns} changeVisibleColumns={this.props.changeVisibleColumns} changeDbIndex={this.props.changeDbIndex} dbIndex={this.props.dbIndex} table={this.props.table} columns={this.props.columns} leftPaneVisibility={this.props.leftPaneVisibility} />
			</div>
		);
	}
}

LeftPane.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styleSheet = createStyleSheet({
	root: {
		width: '29%',
		height: '100%',
		float: 'left',
	},
	rootHide: {
		width: '0%',
		height: '100%',
		float: 'left'
	},
	column: {
		marginLeft: 27
	}
});

export default withStyles(styleSheet)(LeftPane);
