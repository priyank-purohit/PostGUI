import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HistoryIcon from '@material-ui/icons/History';
import HelpIcon from '@material-ui/icons/HelpOutline';
import PowerIcon from '@material-ui/icons/PowerSettingsNew';

import FeatureDiscoveryPrompt from './FeatureDiscoveryPrompt/FeatureDiscoveryPrompt';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';

let _ = require('lodash');
let lib = require('../utils/library.js');


//join: predicted genes, protein seqs
class Navigation extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isSearchBarFdpOpen: false
		}
		this.changeSearchTermDebounce = _.debounce(value => {
			this.props.changeSearchTerm(value);
			this.setState({
				isSearchBarFdpOpen: true
			})
		}, 350);
	}

	changeSearchTerm(e) {
		/*if (e && ((e.key && e.key === 'Enter') || !e.target.value)) {
			this.props.changeSearchTerm(e.target.value);
		}*/
		this.changeSearchTermDebounce(e.target.value);
	}

	render() {
		const classes = this.props.classes;
		let dbTitle = lib.getDbConfig(this.props.dbIndex, "title") || "Untitled database";

		// Set a short window title
		document.title = dbTitle.replace("Database", "db").replace("database", "db");

		return (
			<div className={classes.root}>
				<AppBar position="absolute">
					<Toolbar>
						<FeatureDiscoveryPrompt
							onClose={() => this.setState({ isSearchBarFdpOpen: false })}
							open={!this.props.leftPaneVisibility && this.props.table === "" && !this.state.isSearchBarFdpOpen}
							backgroundColor={pink[500]}
							title="Welcome to PostGUI"
							customPaddingLeft={8.5}
							subtractFromTopPos={0}
							opacity={0.95}
							description="Choose a table to query from the database schema.">
							<IconButton color="inherit" aria-label="Menu" onClick={this.props.toggleLeftPane.bind(this)}>
								<MenuIcon />
							</IconButton>
						</FeatureDiscoveryPrompt>

						<Typography variant="title" color="inherit" className={classes.dbTitleFlex}>
							{dbTitle}
						</Typography>

						<div className={classes.searchBarFlex}>
							<FeatureDiscoveryPrompt
								onClose={() => this.setState({ isSearchBarFdpOpen: false })}
								open={this.state.isSearchBarFdpOpen}
								backgroundColor={indigo[500]}
								title="Search Tables and Columns"
								customPaddingLeft={2}
								subtractFromTopPos={200}
								opacity={0.95}
								description="Tag each term with '[table]' or '[column]'. For example, people[table] firstname[column].">
								<TextField id="search" placeholder="Search tables and columns" onKeyPress={this.changeSearchTerm.bind(this)} onChange={this.changeSearchTerm.bind(this)} onFocus={this.changeSearchTerm.bind(this)} type="search" className={classes.searchBar} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
							</FeatureDiscoveryPrompt>
						</div>
						<IconButton className={classes.rightIconsFlex} color="inherit" aria-label="History" onClick={this.props.toggleHistoryPane.bind(this)}>
							<HistoryIcon className={classes.floatRight} />
						</IconButton>
						<IconButton className={classes.rightIconsFlex} color="inherit" aria-label="Help">
							<HelpIcon className={classes.floatRight} />
						</IconButton>
						<Button color="inherit" aria-label="Logout" className={classes.button}>
							<PowerIcon className={classes.floatRightPadded} />
							Logout
						</Button>
					</Toolbar>
				</AppBar>
			</div>
		);
	}
}

Navigation.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styleSheet = theme => ({
	root: {
		width: '100%'
	},
	dbTitleFlex: {
		flex: 0.3
	},
	searchBarFlex: {
		flex: 0.6,
		display: 'block',
		marginLeft: 5,
		marginRight: 5,
		marginTop: 0,
	},
	searchBar: {
		width: 40 + '%',
		marginLeft: 5,
		marginRight: 5,
		background: 'white',
		padding: 10,
		paddingBottom: 5,
		border: '1px solid grey',
		borderRadius: 3,
		float: 'right'
	},
	rightIconsFlex: {
		flex: 0.05,
		display: 'block'
	},
	floatRight: {
		float: 'right'
	},
	floatRightPadded: {
		float: 'right',
		marginRight: 5
	},
	button: {
		margin: theme.spacing.unit,
	},
});

export default withStyles(styleSheet)(Navigation);