import React, { Component } from 'react';
import logo from '../resources/logo.svg';
import '../styles/Navigation.css';

let lib = require('../utils/library.js');

class Navigation extends Component {
	// If logoUrl is specified in config.json, use that; else use the logo in resources folder
	getImageElement() {
		if (lib.getFromConfig("logoUrl") && lib.getFromConfig("logoUrl") !== '') {
			return (<img src={lib.getFromConfig("logoUrl")} className="leftPaneLogo" alt="logo" />);
		} else {
			return (<img src={logo} className="leftPaneLogo" alt="logo" />);
		}
	}

	render() {
		return (
			<div className="navigation">
				<div className="navigationElement titleElement">
					<div className="logoAndTitle">
						{this.getImageElement()}
						<h3 className="leftPaneTitle">{lib.getFromConfig("title")}</h3>
					</div>
				</div>
				{/*<div className="navigationElement">
					<h3 className="">Data Visualization</h3>
				</div>*/}
				{/*<p className="navigationElement">Data Visualization</p>
				<p className="navigationElement">Custom Query</p>*/}
			</div>
		);
	}
}

export default Navigation;
