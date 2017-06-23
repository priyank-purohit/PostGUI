import React, { Component } from 'react';
import LeftPaneDbSchema from './LeftPaneDbSchema';
import '../styles/LeftPane.css';

class LeftPane extends Component {
	render() {
		return (
			<div className="leftPane">
				<LeftPaneDbSchema 	changeTargetTable={this.props.changeTargetTable}
									changeTargetTableColumns={this.props.changeTargetTableColumns}
									changeSelectTableColumns={this.props.changeSelectTableColumns}
									addRemoveSelectTableColumns={this.props.addRemoveSelectTableColumns}
				/>
			</div>
		);
	}
}

export default LeftPane;
