// @flow weak
import React, { Component } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import Button from "@material-ui/core/Button";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

export default class CircularFab extends Component {
  timer = undefined;

  constructor(props) {
    super(props);
    this.state = {
      table: props.table,
      loading: props.loading,
      success: props.success,
      error: props.error
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
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

  handleButtonClick(event) {
    // let ctrlKeyPressed = false;
    // if (event && event.ctrlKey) {
    // 	ctrlKeyPressed = true;
    // }

    this.props.getRules();
  }

  render() {
    const { loading, success, error } = this.state;
    let buttonClass = null;

    if (success) {
      buttonClass = { ...styleSheet.successButton };
    }

    if (success && error) {
      buttonClass = { ...styleSheet.errorButton };
    }

    return (
      <div style={styleSheet.wrapper}>
        <Button
          variant="fab"
          color="secondary"
          style={buttonClass}
          onClick={this.handleButtonClick}
        >
          {success ? (
            error ? (
              <CloseIcon />
            ) : (
              <CheckIcon />
            )
          ) : (
            <ArrowForwardIcon />
          )}
        </Button>
        {loading && <CircularProgress size={68} style={styleSheet.progress} />}
      </div>
    );
  }
}

const styleSheet = {
  wrapper: {
    marginRight: "5%",
    position: "relative"
  },
  successButton: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700]
    }
  },
  errorButton: {
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700]
    }
  },
  progress: {
    color: green[500],
    position: "absolute",
    top: -6,
    left: -6,
    zIndex: 5
  }
};
