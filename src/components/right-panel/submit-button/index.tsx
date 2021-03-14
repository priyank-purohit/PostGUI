import React, { useState } from 'react';

import { delay } from 'utils/utils';

import { createStyles, Fab, Grid, makeStyles } from '@material-ui/core';
import { green, grey, red } from '@material-ui/core/colors';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import ErrorOutlineIcon from '@material-ui/icons/Error';


const useStyles = makeStyles(() =>
  createStyles({
    buttonSuccess: {
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[700]
      }
    },
    buttonLoading: {
      backgroundColor: grey[500],
      '&:hover': {
        backgroundColor: grey[700]
      }
    },
    buttonError: {
      backgroundColor: red[500],
      '&:hover': {
        backgroundColor: red[700]
      }
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
    <div>
      <Fab
        color='secondary'
        variant='extended'
        style={{width: 160}}
        className={(() => {
          if (buttonState === SUBMIT_STATE.LOADING) {
            return classes.buttonLoading
          }
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
        aria-label='run-query'
      >
        <Grid container alignItems='center'>
          {(() => {
            if (buttonState === SUBMIT_STATE.SUCCESS) {
              return <CheckIcon style={{marginRight: 15}} />
            }
            if (buttonState === SUBMIT_STATE.LOADING) {
              return <CloseIcon style={{marginRight: 15}} />
            }
            if (buttonState === SUBMIT_STATE.ERROR) {
              return <ErrorOutlineIcon style={{marginRight: 15}} />
            }
            if (buttonState === SUBMIT_STATE.READY) {
              return <ArrowForwardIcon style={{marginRight: 15}} />
            }
          })()}

          {(() => {
            if (buttonState === SUBMIT_STATE.SUCCESS) {
              return 'Success!'
            }
            if (buttonState === SUBMIT_STATE.LOADING) {
              return 'Cancel'
            }
            if (buttonState === SUBMIT_STATE.ERROR) {
              return 'Error'
            }
            if (buttonState === SUBMIT_STATE.READY) {
              return 'Run Query'
            }
          })()}
        </Grid>
      </Fab>
    </div>
  )
}
