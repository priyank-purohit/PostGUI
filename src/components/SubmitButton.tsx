import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import Fab from '@material-ui/core/Fab';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';


interface ISubmitButtonProps {
  loading: boolean
  success: boolean
  error: boolean

  getRules: React.EventHandler<any>
}

export const SubmitButton: React.FunctionComponent<ISubmitButtonProps> = (
  props
) => {
  let buttonClass = null
  if (props.success) {
    buttonClass = {...styleSheet.successButton}
  }
  if (props.success && props.error) {
    buttonClass = {...styleSheet.errorButton}
  }

  return (
    <div style={styleSheet.wrapper}>
      <Fab color='secondary' style={buttonClass} onClick={props.getRules}>
        {props.success ? (
          props.error ? (
            <CloseIcon />
          ) : (
            <CheckIcon />
          )
        ) : (
          <ArrowForwardIcon />
        )}
      </Fab>
      {props.loading && (
        <CircularProgress size={68} style={styleSheet.progress} />
      )}
    </div>
  )
}

const styleSheet: any = {
  wrapper: {
    marginRight: '5%',
    position: 'relative'
  },
  successButton: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700]
    }
  },
  errorButton: {
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700]
    }
  },
  progress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 5
  }
}
