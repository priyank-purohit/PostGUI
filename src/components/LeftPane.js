import React, { Component } from 'react';
import LeftPaneTagsDiv from './LeftPaneTagsDiv';
import logo from '../resources/logo.svg';
import '../styles/LeftPane.css';

class LeftPane extends Component {
	render() {
		return (
			<div className="LeftPane">
				<div className="logoAndTitle">
					<img src={logo} className="LeftPane-logo" alt="logo" />
					<h3>PostgUI</h3>
				</div>
				<hr/>
			</div>
		);
	}
}

export default LeftPane;
