import React, { Component } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import Fab from '@material-ui/core/Fab';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

interface CircularFabProps {
  loading: boolean;
  success: boolean;
  error: boolean;

  getRules: Function;
}

interface CircularFabState {}

export default class CircularFab extends Component<
  CircularFabProps,
  CircularFabState
> {
  timer = undefined;

  constructor(props: CircularFabProps) {
    super(props);

    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleButtonClick(event: any) {
    this.props.getRules();
  }

  render() {
    let buttonClass = null;

    if (this.props.success) {
      buttonClass = { ...styleSheet.successButton };
    }

    if (this.props.success && this.props.error) {
      buttonClass = { ...styleSheet.errorButton };
    }

    return (
      <div style={styleSheet.wrapper}>
        <Fab
          color="secondary"
          style={buttonClass}
          onClick={this.handleButtonClick}
        >
          {this.props.success ? (
            this.props.error ? (
              <CloseIcon />
            ) : (
              <CheckIcon />
            )
          ) : (
            <ArrowForwardIcon />
          )}
        </Fab>
        {this.props.loading && (
          <CircularProgress size={68} style={styleSheet.progress} />
        )}
      </div>
    );
  }
}

const styleSheet: any = {
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
