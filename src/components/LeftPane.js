import React, { Component } from 'react';
import LeftPaneTagsDiv from './LeftPaneTagsDiv';
import logo from '../resources/logo.svg';
import '../styles/LeftPane.css';

class LeftPane extends Component {
	render() {
		return (
			<div className="LeftPane">
				<img src={logo} className="LeftPane-logo" alt="logo" />
				<h3>React.js Bookmarks App</h3>
				<hr/>
				<LeftPaneTagsDiv changeTargetTag={this.props.changeTargetTag}/>
			</div>
		);
	}
}

export default LeftPane;
