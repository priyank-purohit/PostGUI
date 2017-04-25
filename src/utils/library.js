exports.rot13ED = function(str) {
	// eslint-disable-next-line
	//return str;
	return str.replace(/[a-zA-Z]/g,function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);});
}

// Retrieves value of key from the config file
exports.getFromConfig = function(key = "title") {
	let configFile = require('../data/config.json');
	let config = JSON.parse(JSON.stringify(configFile));
	return config[key]
}