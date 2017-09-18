// @flow weak
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import green from 'material-ui/colors/green';
import red from 'material-ui/colors/red';
import Button from 'material-ui/Button';
import CheckIcon from 'material-ui-icons/Check';
import CloseIcon from 'material-ui-icons/Close';
import ArrowForwardIcon from 'material-ui-icons/ArrowForward';


class CircularFab extends Component {
	timer = undefined;

	constructor(props) {
		super(props);
		this.state = {
			dbIndex: props.dbIndex,
			table: props.table,
			loading: props.loading,
			success: props.success,
			error: props.error
		};
	}

	componentWillReceiveProps(newProps) {
		this.setState({
			loading: newProps.loading,
			success: newProps.success,
			error: newProps.error
		});
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	handleButtonClick() {
		this.props.getRules();
	};

	render() {
		const { loading, success, error } = this.state;
		const classes = this.props.classes;
		let buttonClass = '';

		if (success) {
			buttonClass = classes.successButton;
		}

		if (success && error) {
			buttonClass = classes.errorButton;
		}

		return (
			<div className={classes.wrapper}>
				<Button
					fab
					color="accent"
					className={buttonClass}
					onClick={this.handleButtonClick.bind(this)}>{success ? (error ? <CloseIcon /> : <CheckIcon />) : <ArrowForwardIcon />}</Button>
				{loading && <CircularProgress size={60} className={classes.progress} />}
			</div>
		);
	}
}

CircularFab.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styleSheet = {
	wrapper: {
		position: 'relative',
		float: 'right',
		marginTop: -8,
		marginRight: '7%'
	},
	successButton: {
		backgroundColor: green[500],
		'&:hover': {
			backgroundColor: green[700],
		},
	},
	errorButton: {
		backgroundColor: red[500],
		'&:hover': {
			backgroundColor: red[700],
		},
	},
	progress: {
		color: green[500],
		position: 'absolute',
		top: -2,
		left: -2,
	},
};

export default withStyles(styleSheet)(CircularFab);