import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import LoginDialog from './LoginDialog.js';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';

import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import HistoryIcon from '@material-ui/icons/History';
import HelpIcon from '@material-ui/icons/HelpOutline';

import FeatureDiscoveryPrompt from './FeatureDiscoveryPrompt/FeatureDiscoveryPrompt';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';

import Button from '@material-ui/core/Button';


let _ = require('lodash');
let lib = require('../utils/library.js');


//join: predicted genes, protein seqs
class Navigation extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isSearchBarFdpOpen: false,
			isLoginFdpOpen: false,
			loginDialogOpen: false
		}
		this.changeSearchTermDebounce = _.debounce(value => {
			this.props.changeSearchTerm(value);
			this.setState({
				isSearchBarFdpOpen: true
			})
		}, 350);
	}

	componentWillReceiveProps(newProps) {
		if (newProps.publicDBStatus === "private") {
			this.setState({
				isLoginFdpOpen: true
			});
		}
	}

	changeSearchTerm(e) {
		/*if (e && ((e.key && e.key === 'Enter') || !e.target.value)) {
			this.props.changeSearchTerm(e.target.value);
		}*/
		this.changeSearchTermDebounce(e.target.value);
	}

	handleLoginButtonClick = () => {
		this.setState({
			loginDialogOpen: !this.state.loginDialogOpen
		});
	}

	handleLoginDialogCloseClick = () => {
		this.setState({
			loginDialogOpen: false
		});
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
						{this.props.loggedIn && (<FeatureDiscoveryPrompt
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
						</FeatureDiscoveryPrompt>)}

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
								description="Can also tag each term with '[table]' or '[column]'. For example, people[table] firstname[column].">
								<TextField
									id="search"
									placeholder="Search"
									onKeyPress={this.changeSearchTerm.bind(this)}
									onChange={this.changeSearchTerm.bind(this)}
									onFocus={this.changeSearchTerm.bind(this)}
									type="search"
									className={classes.searchBar}
									style={this.state.isSearchBarFdpOpen ? { backgroundColor: 'white', border: '1px solid grey', width: 325 + 'px', minWidth: 'inherit' } :
										{ backgroundColor: 'rgba(0, 0, 0, 0.1)', border: 'none', width: 45 + '%', maxWidth: 525 + 'px', minWidth: 325 + 'px' }}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<SearchIcon style={{ fill: "rgba(0,0,0,0.5)" }} />
											</InputAdornment>
										),
									}}
									autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
							</FeatureDiscoveryPrompt>
						</div>
						<IconButton className={classes.rightIconsFlex} color="inherit" aria-label="History" onClick={this.props.toggleHistoryPane.bind(this)}>
							<HistoryIcon className={classes.floatRight} />
						</IconButton>
						<IconButton className={classes.rightIconsFlex} color="inherit" aria-label="Help" onClick={() => { this.setState({ isLoginFdpOpen: !this.state.isLoginFdpOpen }) }}>
							<HelpIcon className={classes.floatRight} />
						</IconButton>
						<FeatureDiscoveryPrompt
							onClose={() => this.setState({ isLoginFdpOpen: false })}
							open={this.state.isLoginFdpOpen && !this.state.isSearchBarFdpOpen}
							backgroundColor={pink[500]}
							title={this.props.publicDBStatus ? "Private Database" : "Login System"}
							subtractFromTopPos={50}
							opacity={0.95}
							description="Provide your credentials for full access.">
							<Button onClick={() => { this.handleLoginButtonClick() }} color="default" variant="contained" className={classes.rightIconsFlex}>Login</Button>
						</FeatureDiscoveryPrompt>
					</Toolbar>
					<LoginDialog
						dbName={dbTitle.replace("Database", "db").replace("database", "db")}
						open={this.state.loginDialogOpen}
						handleLoginButtonClick={this.handleLoginButtonClick}
						handleLoginDialogCloseClick={this.handleLoginDialogCloseClick} />
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
		marginLeft: 5,
		marginRight: 5,
		background: 'white',
		padding: 10,
		paddingBottom: 5,
		borderRadius: 3,
		float: 'right',
		transition: 'all 0.2s'
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