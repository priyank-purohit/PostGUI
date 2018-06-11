import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import DbPicker from './DbPicker.js'
import DbSchema from './DbSchema.js'


class LeftPane extends Component {
	render() {
		const classes = this.props.classes;
		let rootClasses = this.props.leftPaneVisibility === true ? classes.root : classes.root + " " + classes.rootHide;
		return (
			<div className={rootClasses}>
				<DbPicker
					dbIndex={this.props.dbIndex}
					changeDbIndex={this.props.changeDbIndex} />
				<Divider />
				<DbSchema
					dbIndex={this.props.dbIndex}
					table={this.props.table}
					searchTerm={this.props.searchTerm}
					changeSearchTerm={this.props.changeSearchTerm}
					changeTable={this.props.changeTable}
					changeColumns={this.props.changeColumns}
					changeDbSchemaDefinitions={this.props.changeDbSchemaDefinitions}
					changeDbPkInfo={this.props.changeDbPkInfo}
					changeVisibleColumns={this.props.changeVisibleColumns} />
			</div>
		);
	}
}

LeftPane.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styleSheet = {
	root: {
		width: '29%',
		height: '100%',
		float: 'left',
		opacity: 1,
		visibility: 'visible',
		transition: 'width 0.25s, visibility 0.2s, opacity 0.12s'
	},
	rootHide: {
		width: '0%',
		height: '100%',
		float: 'left',
		opacity: 0,
		visibility: 'hidden',
	},
	column: {
		marginLeft: 27
	},
	lowBottomPadding: {
		paddingBottom: 0
	}
};

export default withStyles(styleSheet)(LeftPane);