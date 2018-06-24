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
					{...this.props} />
				<Divider />
				<DbSchema
					{...this.props} />
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
