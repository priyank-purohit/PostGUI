import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import CreateIcon from 'material-ui-icons/Create';

import { CardHeader } from 'material-ui/Card';

let lib = require("../utils/library.js");

class HistoryPane extends Component {
	constructor(props) {
		super(props);
		// urlArray will have the latest URL at the end ... i.e. 0 position is the earliest query, and the highest position index is the latest query...
		this.state = {
			historyPaneVisibility: this.props.historyPaneVisibility || true,
			url: this.props.url,
			urlArray: ["http://hopper.csb.utoronto.ca:3001/annotation_domain?and=(genome_designation.eq.PphAlberta37,description.ilike.*family*)&limit=250000", "http://hopper.csb.utoronto.ca:3001/annotation_domain?and=(genome_designation.eq.PphAlberta37)&limit=250000", "http://hopper.csb.utoronto.ca:3001/annotation_domain?limit=250", "http://hopper.csb.utoronto.ca:3001/annotation_domain?limit=2500", "http://hopper.csb.utoronto.ca:3001/annotation_domain?limit=25000", "http://hopper.csb.utoronto.ca:3001/annotation_domain?limit=2", "http://hopper.csb.utoronto.ca:3001/annotation_domain?limit=25", "http://hopper.csb.utoronto.ca:3001/annotation_domain?limit=259", "http://hopper.csb.utoronto.ca:3001/annotation_domain?and=(genome_designation.eq.PphAlberta37,description.ilike.*family*,and(significance_value.gte.0.00001,significance_value.lte.1))&limit=250000"]
		};
	}

	componentWillReceiveProps(newProps) {
		if (this.state.url !== newProps.url && newProps.url !== "" && newProps.url !== undefined && newProps.url !== null && newProps.url) {
			if (lib.inArray(newProps.url, this.state.urlArray) === false) {
				// insert it
				var arrayvar = this.state.urlArray.slice();
				arrayvar.push(newProps.url);

				this.setState({
					historyPaneVisibility: newProps.historyPaneVisibility,
					url: newProps.url,
					urlArray: arrayvar

				});
			} else {
				// move it to "top" (which in this case is the highest index...)
				this.setState({
					historyPaneVisibility: newProps.historyPaneVisibility,
					url: newProps.url,
					urlArray: lib.moveArrayElementFromTo(this.state.urlArray, lib.elementPositionInArray(newProps.url, this.state.urlArray), this.state.urlArray.length - 1)
				});
			}
		} else {
			this.setState({
				historyPaneVisibility: newProps.historyPaneVisibility
			});
		}
	}

	closeDrawer() {
		this.props.closeHistoryPane();
		this.setState({
			historyPaneVisibility: false,
		});
	};

	render() {
		const classes = this.props.classes;
		const sideList = (
			<div className={classes.list}>
				<CardHeader subheader="Query History" />
				<List dense>
					{
						this.state.urlArray.slice(0).reverse().map((url) => {
							let index = lib.elementPositionInArray(url, this.state.urlArray);
							return (
									<ListItem button key={index}>
										<ListItemIcon>
											<CreateIcon />
										</ListItemIcon>
										<ListItemText primary={url.replace(lib.getDbConfig(0, "url"), "").replace(/\?.*/, "").replace("/", "")} secondary={url.replace(lib.getDbConfig(0, "url"), "").replace(/.*\?/, "").replace(/&/g, "\n").replace(/,/g, ",\n")} />
									</ListItem>
								);
						})
					}
				</List>
			</div>
		);

		return (
			<Drawer anchor="right" open={this.state.historyPaneVisibility} onRequestClose={this.closeDrawer.bind(this)}>
				<div tabIndex={0} role="button">
					{sideList}
				</div>
			</Drawer>
		);
	}
}

HistoryPane.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styleSheet = {
	root: {
		width: '30%',
		height: '100%',
		float: 'right'
	},
	list: {
		width: 400,
	},
	listFull: {
		width: 'auto',
	}
};

export default withStyles(styleSheet)(HistoryPane);