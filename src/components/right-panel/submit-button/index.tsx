import React, { useState } from 'react';

import { delay } from 'utils/utils';

import { CircularProgress, createStyles, Fab, makeStyles, Theme } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center'
    },
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative'
    },
    buttonSuccess: {
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[700]
      }
    },
    buttonError: {
      backgroundColor: red[500],
      '&:hover': {
        backgroundColor: red[700]
      }
    },
    fabProgress: {
      color: green[500],
      position: 'absolute',
      top: -6,
      left: -6,
      zIndex: 1
    },
    buttonProgress: {
      color: green[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12
    }
  })
)

export enum SUBMIT_STATE {
  READY,
  LOADING,
  SUCCESS,
  ERROR
}

export const SubmitButton: React.FC = () => {
  const classes = useStyles()

  const [buttonState, setButtonState] = useState<SUBMIT_STATE>(
    SUBMIT_STATE.READY
  )

  return (
    <div className={classes.wrapper}>
      <Fab
        aria-label='save'
        color='primary'
        className={(() => {
          if (buttonState === SUBMIT_STATE.SUCCESS) {
            return classes.buttonSuccess
          }
          if (buttonState === SUBMIT_STATE.ERROR) {
            return classes.buttonError
          }
          return undefined
        })()}
        onClick={async () => {
          setButtonState(SUBMIT_STATE.LOADING)
          await delay(1500)
          setButtonState(SUBMIT_STATE.ERROR)
          await delay(1500)
          setButtonState(SUBMIT_STATE.SUCCESS)
          await delay(1500)
          setButtonState(SUBMIT_STATE.READY)
        }}
      >
        {(() => {
          if (buttonState === SUBMIT_STATE.SUCCESS) {
            return <CheckIcon />
          }
          if (buttonState === SUBMIT_STATE.LOADING) {
            return <CloseIcon />
          }
          if (buttonState === SUBMIT_STATE.ERROR) {
            return <WarningIcon />
          }
          if (buttonState === SUBMIT_STATE.READY) {
            return <ArrowForwardIcon />
          }
        })()}
      </Fab>
      {buttonState === SUBMIT_STATE.LOADING && (
        <CircularProgress size={68} className={classes.fabProgress} />
      )}
    </div>
  )
}
