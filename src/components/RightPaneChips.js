import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Chip from 'material-ui/Chip';

class RightPaneChips extends Component {
	constructor(props) {
		super(props);

		this.state = {
			rows: props.rows ? props.rows : 0,
			tip: "Tip: Hold shift and click to multi-sort!",
			tip2: "Increase row-limit to see full result."
		}
	}

	componentWillReceiveProps(newProps) {
		this.setState({
			rows: newProps.rows ? newProps.rows : 0
		});
	}
	render() {
		const classes = this.props.classes;
		return (
			<div className={classes.row}>
				<Chip label={"Displaying " + this.state.rows + " rows"} key={1} className={classes.chip} />
				<Chip label={this.state.tip2} key={3} className={classes.chip} />
				<Chip label={this.state.tip} key={2} className={classes.chip} />
			</div>
		);
	}
}

RightPaneChips.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styleSheet = createStyleSheet(theme => ({
  chip: {
    margin: theme.spacing.unit / 2,
  },
  row: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    marginTop: -30,
    marginRight: '1%'
  },
}));

export default withStyles(styleSheet)(RightPaneChips);