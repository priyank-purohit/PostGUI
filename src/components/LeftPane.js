import React, { Component } from 'react';
import LeftPaneDbSchema from './LeftPaneDbSchema';
import '../styles/LeftPane.css';

class LeftPane extends Component {
	render() {
		return (
			<div className="LeftPane">
				<LeftPaneDbSchema changeTargetTag={this.props.changeTargetTag}/>
			</div>
		);
	}
}

export default LeftPane;
