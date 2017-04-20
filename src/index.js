import React from 'react';
import ReactDOM from 'react-dom';

import LeftPane from './components/LeftPane';
import MiddlePane from './components/MiddlePane';

import HistoryPane from './components/HistoryPane';

import './styles/index.css';

export default class Layout extends React.Component {
	constructor() {
		super();
		this.state = {
			targetTag: "Gnt 1"
		};
	}

	changeTargetTag(newTag) {
		this.setState({targetTag: newTag});
	}

	render() {
		return (
			<div>
				<LeftPane changeTargetTag={this.changeTargetTag.bind(this)} />
				<MiddlePane tag={this.state.targetTag}/>
				<HistoryPane />
			</div>
		);
	}
}

const app = document.getElementById('root');
ReactDOM.render(<Layout/>, app);