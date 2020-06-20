import React, {Component} from 'react'
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import amber from '@material-ui/core/colors/amber'

export default class Help extends Component {
  transition(props) {
    return <Slide direction='up' {...props} />
  }

  render() {
    return (
      <Dialog
        fullScreen
        open={this.props.open}
        onClose={this.props.handleHelpToggle}
        TransitionComponent={this.transition}
      >
        <AppBar style={styleSheet.appBar}>
          <Toolbar>
            <IconButton
              color='default'
              onClick={this.props.handleHelpToggle}
              aria-label='Close'
            >
              <CloseIcon />
            </IconButton>
            <Typography variant='title' color='default' style={styleSheet.flex}>
              Help
            </Typography>
          </Toolbar>
        </AppBar>
        <img
          src={require('../resources/mr_clippy.jpeg')}
          alt='Help section not available yet'
          width={400}
          style={styleSheet.centered}
        />
      </Dialog>
    )
  }
}

const styleSheet = {
  appBar: {
    position: 'relative',
    color: 'black',
    background: amber[600]
  },
  flex: {
    flex: 1
  },
  centered: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20
  }
}
