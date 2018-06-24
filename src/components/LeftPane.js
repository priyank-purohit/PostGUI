import React, { Component } from 'react';
import Divider from '@material-ui/core/Divider';
import DbPicker from './DbPicker.js'
import DbSchema from './DbSchema.js'


export default class LeftPane extends Component {
	render() {
		let rootClasses = this.props.leftPaneVisibility === true ? styleSheet.root : styleSheet.rootHide;
		return (
			<div style={{ ...rootClasses }}>
				<DbPicker
					dbIndex={this.props.dbIndex}
					changeDbIndex={this.props.changeDbIndex} />
				<Divider />
				<DbSchema
					isLoggedIn={this.props.isLoggedIn}
					token={this.props.token}
					dbIndex={this.props.dbIndex}
					table={this.props.table}
					publicDBStatus={this.props.publicDBStatus}
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
		transition: 'width 0.25s, visibility 0.2s, opacity 0.12s'
	},
	column: {
		marginLeft: 27
	},
	lowBottomPadding: {
		paddingBottom: 0
	}
};
