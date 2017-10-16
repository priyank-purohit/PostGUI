import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';

class RightPaneChips extends Component {
	constructor(props) {
		super(props);

		// rows = number of rows in response
		// totalRows = number of rows in query result (i.e. full result count)
		// rowLimit = user set row limit
		// maxRows = app wide limit on max value for rowLimit
		this.state = {
			rows: props.rows ? props.rows : 0,
			totalRows: props.totalRows ? props.totalRows : 0,
			rowLimit: props.rowLimit ? props.rowLimit : 2500,
			maxRows: props.maxRows ? props.maxRows : 100000,
			tip: "Tip: Hold shift and click to multi-sort!",
			tip2: "Increase row-limit for full result.",
			title2: "Resubmit query with higher row-limit to get all rows in the result.",
			tip3: "Download option allows for 2.5M row-limit.",
			title3: "To get access to an even bigger output, check help section!"
		}
	}

	componentWillReceiveProps(newProps) {
		this.setState({
			rows: newProps.rows ? newProps.rows : 0,
			totalRows: newProps.totalRows ? newProps.totalRows : 0,
			rowLimit: newProps.rowLimit ? newProps.rowLimit : 2500,
			maxRows: newProps.maxRows ? newProps.maxRows : 100000,
		});
	}
	render() {
		const classes = this.props.classes;
		let rowCountChipLabel = "Displaying " + this.state.rows + " rows";
		if (this.props.totalRows >= 0) {
			rowCountChipLabel = "Displaying " + this.state.rows + " of " + String(this.props.totalRows).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " rows";
		}
		return (
			<div className={classes.row}>
				<Chip label={rowCountChipLabel} key={1} className={classes.chip} />
				{this.state.rows === this.state.rowLimit && this.state.rows !== this.state.maxRows ? <Chip label={this.state.tip2} title={this.state.title2} key={3} className={classes.chip} /> : <div></div>}
				{this.state.rows === this.state.maxRows ? <Chip label={this.state.tip3} title={this.state.title3} key={2} className={classes.chip} /> : <div></div>}
				<Chip label={this.state.tip} key={4} className={classes.chip} />
			</div>
		);
	}
}

RightPaneChips.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styleSheet = {
	chip: {
		margin: 5,
	},
	row: {
		display: 'flex',
		justifyContent: 'flex-end',
		flexWrap: 'wrap',
		marginTop: -30,
		marginRight: '1%'
	},
};

export default withStyles(styleSheet)(RightPaneChips);