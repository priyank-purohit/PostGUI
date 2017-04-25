import React, { Component } from 'react';
import '../styles/MiddlePane.css';

var data = require('../data/data.json');

class MiddlePane extends Component {
	getValuesForKey(key) {
		var values = [];
		if (data[key]) {
			for (var i = 0; i < (data[key]).length; i++) {
				values.push(data[key][i]);
			}
			return this.buildURLsIntoHtmlCode(values);
		}
	}

	visitPage(url) {
        window.open(url, '_blank');
    }

	buildURLsIntoHtmlCode(URLs) {
		var domObjectList = [];
		for (var i = 0; i < URLs.length; i++) {
			var url = URLs[i];
			var width = 280;
			var height = 157.5;

			// Replace the stuff inside the <div> tag to whatever you want to display
			const div = <div key={url+4} width={width+5} height={height+25} style={{float: 'left', borderBottom: '0px solid black'}} className="leDivs">
							<iframe key={url} width={width} height={height} src={url} style={{padding: 5 + 'px'}} frameBorder="0"></iframe>
							<br key={url+2}/>
							<button key={url+1} type="button" width={width} style={{textAlign: 'center', position: 'relative', margin: '0 auto', display: 'block'}} onClick={this.visitPage.bind(this, url)} >Open in New Tab</button>
							<br key={url+3}/>
						</div>;

			domObjectList.push(div);
		}
		return domObjectList;
	}

	render() {
		return (
			<div className="MiddlePane">
				<div className="MiddlePaneInner">
					{/*this.getValuesForKey(this.props.tag)*/}
				</div>
			</div>
		);
	}
}

export default MiddlePane;
