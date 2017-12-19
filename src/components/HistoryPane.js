import React, { Component } from 'react';
//import {CopyToClipboard} from 'react-copy-to-clipboard';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
//import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemIcon, ListItemText, ListSubheader } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import EditIcon from 'material-ui-icons/Edit';
import DeleteIcon from 'material-ui-icons/Delete';
//import LinkIcon from 'material-ui-icons/Link';

let _ = require('lodash');
let lib = require("../utils/library.js");

class HistoryPane extends Component {
	constructor(props) {
		super(props);

		//localStorage.setItem("localHistory", JSON.stringify([["http://hopper.csb.utoronto.ca:3001/annotation_domain?and=(protein_id.eq.ALP80_00672,genome_designation.eq.PfrICMP7712)&limit=25000", {"condition":"AND","rules":[{"id":"protein_id","field":"protein_id","type":"string","input":"text","operator":"equal","value":"ALP80_00672"},{"id":"genome_designation","field":"genome_designation","type":"string","input":"text","operator":"equal","value":"PfrICMP7712"}],"not":false,"valid":true}],["http://hopper.csb.utoronto.ca:3001/annotation_go?and=(go_id.eq.GO:0005215)&limit=25000", {"condition":"AND","rules":[{"id":"go_id","field":"go_id","type":"string","input":"text","operator":"equal","value":"GO:0005215"}],"not":false,"valid":true}],["http://hopper.csb.utoronto.ca:3001/annotation_pathway?and=(pathway_name.ilike.*Lipid metabolism*)&limit=25000", {"condition":"AND","rules":[{"id":"pathway_name","field":"pathway_name","type":"string","input":"text","operator":"contains","value":"Lipid metabolism"}],"not":false,"valid":true}],["http://hopper.csb.utoronto.ca:3001/gene_feature?and=(nuc_length.gte.2500)&limit=25000", {"condition":"AND","rules":[{"id":"nuc_length","field":"nuc_length","type":"string","input":"text","operator":"greater_or_equal","value":"2500"}],"not":false,"valid":true}],["http://hopper.csb.utoronto.ca:3001/genome_characteristics?and=(host_common.eq.wheat)&limit=25000", {"condition":"AND","rules":[{"id":"host_common","field":"host_common","type":"string","input":"text","operator":"equal","value":"wheat"}],"not":false,"valid":true}],["http://hopper.csb.utoronto.ca:3001/annotation_domain?and=(protein_id.ilike.*ALP80*,genome_designation.eq.PfrICMP7712,description.ilike.*kinase*,or(significance_value.eq.2.6e-200,significance_value.lte.2e-28))&limit=25000",{"condition":"AND","rules":[{"id":"protein_id","field":"protein_id","type":"string","input":"text","operator":"contains","value":"ALP80"},{"id":"genome_designation","field":"genome_designation","type":"string","input":"text","operator":"equal","value":"PfrICMP7712"},{"id":"description","field":"description","type":"string","input":"text","operator":"contains","value":"kinase"},{"condition":"OR","rules":[{"id":"significance_value","field":"significance_value","type":"double","input":"number","operator":"equal","value":"2.6e-200"},{"id":"significance_value","field":"significance_value","type":"double","input":"number","operator":"less_or_equal","value":"2e-28"}],"not":false}],"not":false,"valid":true}],["http://hopper.csb.utoronto.ca:3001/annotation_domain?and=(protein_id.ilike.*ALP80*,genome_designation.eq.PfrICMP7712,description.ilike.*kinase*,or(significance_value.eq.2.6e-200,significance_value.lte.2e-28,and(significance_value.gte.5.4e-27,significance_value.lte.1.9e-22)))&limit=25000",{"condition":"AND","rules":[{"id":"protein_id","field":"protein_id","type":"string","input":"text","operator":"contains","value":"ALP80"},{"id":"genome_designation","field":"genome_designation","type":"string","input":"text","operator":"equal","value":"PfrICMP7712"},{"id":"description","field":"description","type":"string","input":"text","operator":"contains","value":"kinase"},{"condition":"OR","rules":[{"id":"significance_value","field":"significance_value","type":"double","input":"number","operator":"equal","value":"2.6e-200"},{"id":"significance_value","field":"significance_value","type":"double","input":"number","operator":"less_or_equal","value":"2e-28"},{"condition":"AND","rules":[{"id":"significance_value","field":"significance_value","type":"double","input":"number","operator":"greater_or_equal","value":"5.4e-27"},{"id":"significance_value","field":"significance_value","type":"double","input":"number","operator":"less_or_equal","value":"1.9e-22"}],"not":false}],"not":false}],"not":false,"valid":true}],["http://hopper.csb.utoronto.ca:3001/annotation_domain?and=(protein_id.ilike.*ALP80*,genome_designation.eq.PfrICMP7712,description.ilike.*kinase*,or(significance_value.eq.2.6e-200,significance_value.lte.2e-28,and(significance_value.gte.5.4e-27,significance_value.lte.1.9e-22)),not.and(description.ilike.*Shikimate*))&limit=25000",{"condition":"AND","rules":[{"id":"protein_id","field":"protein_id","type":"string","input":"text","operator":"contains","value":"ALP80"},{"id":"genome_designation","field":"genome_designation","type":"string","input":"text","operator":"equal","value":"PfrICMP7712"},{"id":"description","field":"description","type":"string","input":"text","operator":"contains","value":"kinase"},{"condition":"OR","rules":[{"id":"significance_value","field":"significance_value","type":"double","input":"number","operator":"equal","value":"2.6e-200"},{"id":"significance_value","field":"significance_value","type":"double","input":"number","operator":"less_or_equal","value":"2e-28"},{"condition":"AND","rules":[{"id":"significance_value","field":"significance_value","type":"double","input":"number","operator":"greater_or_equal","value":"5.4e-27"},{"id":"significance_value","field":"significance_value","type":"double","input":"number","operator":"less_or_equal","value":"1.9e-22"}],"not":false}],"not":false},{"condition":"AND","rules":[{"id":"description","field":"description","type":"string","input":"text","operator":"contains","value":"Shikimate"}],"not":true}],"not":false,"valid":true}]]));
		let localHistoryArray = JSON.parse(localStorage.getItem("localHistory") ? localStorage.getItem("localHistory") : "[]");
		localHistoryArray = JSON.stringify(localHistoryArray) === "[]" ? null : localHistoryArray;
		
		// historyArray will have the latest URL at the end ... i.e. 0 position is the earliest query, and the highest position index is the latest query...
		// TODO: Need to make historyArray db specific!!!
		this.state = {
			historyPaneVisibility: this.props.historyPaneVisibility || false,
			newHistoryItem: this.props.newHistoryItem,
			displayIndex: -1,
			historyArray: localHistoryArray ? localHistoryArray : [["http://hopper.csb.utoronto.ca:3001/annotation_domain?and=(protein_id.eq.ALP80_00672,genome_designation.eq.PfrICMP7712)&limit=25000", {"condition":"AND","rules":[{"id":"protein_id","field":"protein_id","type":"string","input":"text","operator":"equal","value":"ALP80_00672"},{"id":"genome_designation","field":"genome_designation","type":"string","input":"text","operator":"equal","value":"PfrICMP7712"}],"not":false,"valid":true}],["http://hopper.csb.utoronto.ca:3001/annotation_go?and=(go_id.eq.GO:0005215)&limit=25000", {"condition":"AND","rules":[{"id":"go_id","field":"go_id","type":"string","input":"text","operator":"equal","value":"GO:0005215"}],"not":false,"valid":true}],["http://hopper.csb.utoronto.ca:3001/annotation_pathway?and=(pathway_name.ilike.*Lipid metabolism*)&limit=25000", {"condition":"AND","rules":[{"id":"pathway_name","field":"pathway_name","type":"string","input":"text","operator":"contains","value":"Lipid metabolism"}],"not":false,"valid":true}],["http://hopper.csb.utoronto.ca:3001/gene_feature?and=(nuc_length.gte.2500)&limit=25000", {"condition":"AND","rules":[{"id":"nuc_length","field":"nuc_length","type":"string","input":"text","operator":"greater_or_equal","value":"2500"}],"not":false,"valid":true}],["http://hopper.csb.utoronto.ca:3001/genome_characteristics?and=(host_common.eq.wheat)&limit=25000", {"condition":"AND","rules":[{"id":"host_common","field":"host_common","type":"string","input":"text","operator":"equal","value":"wheat"}],"not":false,"valid":true}],["http://hopper.csb.utoronto.ca:3001/annotation_domain?and=(protein_id.ilike.*ALP80*,genome_designation.eq.PfrICMP7712,description.ilike.*kinase*,or(significance_value.eq.2.6e-200,significance_value.lte.2e-28))&limit=25000",{"condition":"AND","rules":[{"id":"protein_id","field":"protein_id","type":"string","input":"text","operator":"contains","value":"ALP80"},{"id":"genome_designation","field":"genome_designation","type":"string","input":"text","operator":"equal","value":"PfrICMP7712"},{"id":"description","field":"description","type":"string","input":"text","operator":"contains","value":"kinase"},{"condition":"OR","rules":[{"id":"significance_value","field":"significance_value","type":"double","input":"number","operator":"equal","value":"2.6e-200"},{"id":"significance_value","field":"significance_value","type":"double","input":"number","operator":"less_or_equal","value":"2e-28"}],"not":false}],"not":false,"valid":true}],["http://hopper.csb.utoronto.ca:3001/annotation_domain?and=(protein_id.ilike.*ALP80*,genome_designation.eq.PfrICMP7712,description.ilike.*kinase*,or(significance_value.eq.2.6e-200,significance_value.lte.2e-28,and(significance_value.gte.5.4e-27,significance_value.lte.1.9e-22)))&limit=25000",{"condition":"AND","rules":[{"id":"protein_id","field":"protein_id","type":"string","input":"text","operator":"contains","value":"ALP80"},{"id":"genome_designation","field":"genome_designation","type":"string","input":"text","operator":"equal","value":"PfrICMP7712"},{"id":"description","field":"description","type":"string","input":"text","operator":"contains","value":"kinase"},{"condition":"OR","rules":[{"id":"significance_value","field":"significance_value","type":"double","input":"number","operator":"equal","value":"2.6e-200"},{"id":"significance_value","field":"significance_value","type":"double","input":"number","operator":"less_or_equal","value":"2e-28"},{"condition":"AND","rules":[{"id":"significance_value","field":"significance_value","type":"double","input":"number","operator":"greater_or_equal","value":"5.4e-27"},{"id":"significance_value","field":"significance_value","type":"double","input":"number","operator":"less_or_equal","value":"1.9e-22"}],"not":false}],"not":false}],"not":false,"valid":true}],["http://hopper.csb.utoronto.ca:3001/annotation_domain?and=(protein_id.ilike.*ALP80*,genome_designation.eq.PfrICMP7712,description.ilike.*kinase*,or(significance_value.eq.2.6e-200,significance_value.lte.2e-28,and(significance_value.gte.5.4e-27,significance_value.lte.1.9e-22)),not.and(description.ilike.*Shikimate*))&limit=25000",{"condition":"AND","rules":[{"id":"protein_id","field":"protein_id","type":"string","input":"text","operator":"contains","value":"ALP80"},{"id":"genome_designation","field":"genome_designation","type":"string","input":"text","operator":"equal","value":"PfrICMP7712"},{"id":"description","field":"description","type":"string","input":"text","operator":"contains","value":"kinase"},{"condition":"OR","rules":[{"id":"significance_value","field":"significance_value","type":"double","input":"number","operator":"equal","value":"2.6e-200"},{"id":"significance_value","field":"significance_value","type":"double","input":"number","operator":"less_or_equal","value":"2e-28"},{"condition":"AND","rules":[{"id":"significance_value","field":"significance_value","type":"double","input":"number","operator":"greater_or_equal","value":"5.4e-27"},{"id":"significance_value","field":"significance_value","type":"double","input":"number","operator":"less_or_equal","value":"1.9e-22"}],"not":false}],"not":false},{"condition":"AND","rules":[{"id":"description","field":"description","type":"string","input":"text","operator":"contains","value":"Shikimate"}],"not":true}],"not":false,"valid":true}]],
			dialogVisibility: this.props.classes.hide
		};
		this.changeDisplayIndexDebounce = _.debounce(value => this.setState({displayIndex: value}), 300);
	}

	// Keeps track of the incoming queries in an array
	componentWillReceiveProps(newProps) {
		this.setState({
			historyPaneVisibility: newProps.historyPaneVisibility
		});

		// If the incoming newHistoryItem isn't already the current state.newHistoryItem AND it actually exists THEN
		if (this.state.newHistoryItem !== newProps.newHistoryItem && 
			newProps.newHistoryItem !== [] && 
			newProps.newHistoryItem !== undefined && 
			newProps.newHistoryItem !== null && 
			newProps.newHistoryItem) {
			// Check if the new item already exists in the historyArray
			if (lib.inArray(newProps.newHistoryItem, this.state.historyArray) === false) { // doesn't exist, so insert it at highestIndex+1 position (i.e. 0th index is oldest)
				var arrayvar = this.state.historyArray.slice();
				arrayvar.push(newProps.newHistoryItem);

				this.setState({
					historyPaneVisibility: newProps.historyPaneVisibility,
					newHistoryItem: newProps.newHistoryItem,
					historyArray: arrayvar
				}, () => {
					localStorage.setItem("localHistory", JSON.stringify(this.state.historyArray));
				});
			} else { // already exists, move it to "top" (which in this case is the highest index...)
				this.setState({
					historyPaneVisibility: newProps.historyPaneVisibility,
					newHistoryItem: newProps.newHistoryItem,
					historyArray: lib.moveArrayElementFromTo(this.state.historyArray, lib.elementPositionInArray(newProps.newHistoryItem, this.state.historyArray), this.state.historyArray.length - 1)
				}, () => {
					localStorage.setItem("localHistory", JSON.stringify(this.state.historyArray));
				});
			}
		} else {
			// just make sure the (potentially) new visibility setting is saved...
			this.setState({
				historyPaneVisibility: newProps.historyPaneVisibility
			});
		}
	}

	// Loads the History Item in the Query Builder
	handleHistoryItemClick(index) {
		let url = this.state.historyArray[index][0];
		let rules = this.state.historyArray[index][1];
		//console.log("[",JSON.stringify(url),"," ,JSON.stringify(rules),"]");
		this.props.changeTable(this.extractTableNameFromURL(url, true));
		this.props.changeRules(rules);
	}

	closeDrawer() {
		this.props.closeHistoryPane();
		this.setState({
			historyPaneVisibility: false,
		});
	};

	extractTableNameFromURL(url, getRaw = false) {
		let rawTableName = url.replace(lib.getDbConfig(this.props.dbIndex, "url"), "").replace(/\?.*/, "").replace(/\s/g, "").replace("/", "");

		if (getRaw) { return rawTableName; }

		let tableRename = lib.getTableConfig(this.props.dbIndex, rawTableName, "rename");
		let displayName = tableRename ? tableRename : rawTableName;

		return displayName;
	}

	cleanUpRules(url) {
		return url.replace(lib.getDbConfig(this.props.dbIndex, "url"), "").replace(/.*\?/, "").replace(/&/g, "\n").replace(/,/g, ",\n").replace(/limit=\d*/g, "");
	}


	recursiveRulesExtraction(rules, condition, depth = 0) {
		let rulesArray = [];
		if (rules.length > 1) {
			rulesArray = [[Array(depth).join("\t") + condition]];
		}
		for (let i = 0; i < rules.length; i++) {
			let potentialName = rules[i]['field'];
			if (potentialName !== null && potentialName !== undefined) {
				rulesArray.push([Array(depth+1).join("\t") + potentialName, rules[i]['operator'], rules[i]['value']]);
			} else {
				// Check if it's a GROUP by looking for "condition" key
				if (rules[i]['condition'] === "AND" || rules[i]['condition'] === "OR") {
					let subGroupRules = this.recursiveRulesExtraction(rules[i]['rules'], rules[i]['condition'], depth+1);
					for (let ii = 0; ii < subGroupRules.length; ii++) {
						if (subGroupRules[ii] !== null && subGroupRules[ii] !== undefined) {
							rulesArray.push(subGroupRules[ii]);
						}
					}
				}
			}
		}
		return rulesArray;
	}

	changeDisplayIndex(newDisplayIndex) {
		this.changeDisplayIndexDebounce(newDisplayIndex);
	}

	showDeleteHistoryDialog() {
		const classes = this.props.classes;
		if (this.state.dialogVisibility === null) {
			this.setState({
				dialogVisibility: classes.hide
			});
		} else {
			this.setState({
				dialogVisibility: null
			});
		}
	}

	deleteHistory() {
		this.setState({
			historyArray: []
		}, () => {
			localStorage.setItem("localHistory", []);
		});
		this.showDeleteHistoryDialog();
	}


	render() {
		const classes = this.props.classes;
		const sideList = (
			<div className={classes.list}>
				<List
					dense
					subheader={<ListSubheader>Query History
								<IconButton style={{float: "right"}}
									aria-label="Delete"
									onClick={this.showDeleteHistoryDialog.bind(this)}>
									<DeleteIcon/>
								</IconButton>
								</ListSubheader>}>
					<div style={{marginLeft: "250px", height: "100px", width: "100%"}} className={this.state.dialogVisibility}>
						<ListSubheader style={{marginLeft: "10px"}}>Delete history?</ListSubheader>
						<Button onClick={this.deleteHistory.bind(this)} dense raised style={{margin: "5px"}}>Yes</Button>
						<Button onClick={this.showDeleteHistoryDialog.bind(this)} dense raised color="primary" style={{margin: "5px"}}>No</Button>
					</div>
					{
						this.state.historyArray.slice(0).reverse().map((item) => {
							if (item[0] && item[1]) {
								let rules = this.recursiveRulesExtraction(item[1]['rules'], item[1]['condition'], 0);
								let index = lib.elementPositionInArray(item, this.state.historyArray);

								// When user hovers over an item, show rest of the lines
								let classNames = this.props.classes.hide;
								if (this.state.displayIndex === index) {
									classNames = null;
								}

								return (
										<ListItem button key={index} onMouseEnter={this.changeDisplayIndex.bind(this, index)} onClick={this.handleHistoryItemClick.bind(this, index)}>
											
											<ListItemIcon className={classes.noStyleButton}  onClick={this.handleHistoryItemClick.bind(this, index)}>
												<EditIcon/>
											</ListItemIcon>
											
											<div>
												<ListItemText primary={this.extractTableNameFromURL(item[0])}/>
												{
													rules.map((rule) => {
														let displayStr = "";
														let columnName = "";
														let displayName = "";
														let rawOperator = "";
														let niceOperator = "";
														for (let i = 0; i < rule.length; i++) {
															displayStr += " " + rule[i] + " ";
															// if there are more than 1 rules (i.e. it's not AND/OR only) then extract column name
															if (i === 1) {
																columnName = rule[0].replace(/\s/g, "");
																rawOperator = rule[1].replace(/\s/g, "");
																niceOperator = lib.translateOperatorToHuman(rawOperator);
															}
														}

														// find column's rename rules from config
														if (columnName) {
															let columnRename = lib.getColumnConfig(this.props.dbIndex, this.extractTableNameFromURL(item[0], true), columnName, "rename");
															displayName = columnRename ? columnRename : columnName;
														}

														displayStr = displayStr.replace(columnName, displayName).replace(rawOperator, niceOperator).replace(/\t/g, " . . ");
														let currRuleIndexInRules = lib.elementPositionInArray(rule, rules);

														return <ListItemText secondary={displayStr} key={index+rule} className={currRuleIndexInRules > 3 ? classNames : null}/>;
													})
												}
											</div>
										</ListItem>
									);
							} else {
								let index = lib.elementPositionInArray(item, this.state.historyArray);

								return (
										<ListItem button key={index} onMouseEnter={this.changeDisplayIndex.bind(this, index)} onClick={this.handleHistoryItemClick.bind(this, index)}>
											
											<ListItemIcon className={classes.noStyleButton}  onClick={this.handleHistoryItemClick.bind(this, index)}>
												<EditIcon/>
											</ListItemIcon>
											
											<div>
												<ListItemText primary={this.extractTableNameFromURL(item[0])}/>
											</div>
										</ListItem>
									);
							}
						})
					}
				</List>
			</div>
		);

		return (
			<Drawer anchor="right" open={this.state.historyPaneVisibility} onClose={this.closeDrawer.bind(this)}>
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
	},
	noStyleButton: {
		border: "none",
		backgroundColor: "transparent"
	},
	hide: {
		display: 'none'
	}
};

export default withStyles(styleSheet)(HistoryPane);