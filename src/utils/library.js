exports.rot13ED = function(str) {
	// eslint-disable-next-line
	return str.replace(/[a-zA-Z]/g,function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);});
}

exports.getKeysFromJSON(jsonDataStr) {
	var keys = [];
	for (var k in jsonDataStr) {
		keys.push(<button key={k} id={k} className="tagsButton" onClick={this.handleClick.bind(this)}>{k}</button>);
		keys.push(<br key={k+1}/>);
	}
	return keys;
}
