import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import LeftPane from './components/LeftPane';
import RightPane from './components/RightPane';
import './styles/index.css';

export default class Layout extends React.Component {
	constructor() {
		super();
		this.state = {
		};
	}

	changeTargetTag(newTag) {
		this.setState({targetTag: newTag});
	}

	render() {
		return (
			<div>
				<LeftPane changeTargetTag={this.changeTargetTag.bind(this)} />
				<RightPane tag={this.state.targetTag}/>
			</div>
		);
	}
}

const app = document.getElementById('root');
ReactDOM.render(<Layout/>, app);