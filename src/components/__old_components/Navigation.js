import React, {Component} from 'react'

import LoginDialog from './LoginDialog'
import Help from './Help.js'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'

import SearchIcon from '@material-ui/icons/Search'
import MenuIcon from '@material-ui/icons/Menu'
import HistoryIcon from '@material-ui/icons/History'
import HelpIcon from '@material-ui/icons/HelpOutline'

import FeatureDiscoveryPrompt from './FeatureDiscoveryPrompt/FeatureDiscoveryPrompt'
import indigo from '@material-ui/core/colors/indigo'
import pink from '@material-ui/core/colors/pink'

import Button from '@material-ui/core/Button'

const _ = require('lodash')
const lib = require('../utils/library.ts')

// join: predicted genes, protein seqs
export default class Navigation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSearchBarFdpOpen: false,
      isLoginFdpOpen: null,
      loginDialogOpen: false,
      isHelpOpen: false
    }
    this.changeSearchTermDebounce = _.debounce((value) => {
      this.props.changeSearchTerm(value)
      this.setState({
        isSearchBarFdpOpen: true
      })
    }, 350)
  }

  componentWillReceiveProps(newProps) {
    if (
      (newProps.publicDBStatus === 'private' ||
        newProps.publicDBStatus === 'read') &&
      !newProps.isLoggedIn
    ) {
      if (this.state.isLoginFdpOpen === null) {
        this.setState({
          isLoginFdpOpen: true
        })
      }
    }
  }

  changeSearchTerm(e) {
    /* if (e && ((e.key && e.key === 'Enter') || !e.target.value)) {
			this.props.changeSearchTerm(e.target.value);
		} */
    this.changeSearchTermDebounce(e.target.value)
  }

  handleLoginButtonClick = () => {
    if (this.props.isLoggedIn) {
      // logout the user
      this.props.handleLogoutClick()
    } else {
      this.setState({
        loginDialogOpen: !this.state.loginDialogOpen
      })
    }
  }

  handleLoginDialogCloseClick = () => {
    this.setState({
      loginDialogOpen: false
    })
  }

  handleHelpToggle = (e) => {
    this.setState({
      isHelpOpen: !this.state.isHelpOpen
    })
  }

  render() {
    const dbTitle =
      lib.getDbConfig(this.props.dbIndex, 'title') || 'Untitled database'
    let searchBarFdpOpenStyles = null
    if (this.state.isSearchBarFdpOpen) {
      searchBarFdpOpenStyles = {
        backgroundColor: 'white',
        border: '1px solid grey',
        width: `${325}px`,
        minWidth: 'inherit'
      }
    } else {
      searchBarFdpOpenStyles = {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        width: `${45}%`,
        maxWidth: `${525}px`,
        minWidth: `${325}px`
      }
    }

    // Set a short window title
    document.title = dbTitle.replace('Database', 'db').replace('database', 'db')

    return (
      <>
        <AppBar position='absolute'>
          <Toolbar>
            <FeatureDiscoveryPrompt
              onClose={() => this.setState({isSearchBarFdpOpen: false})}
              open={
                !this.props.leftPaneVisibility &&
                this.props.table === '' &&
                !this.state.isSearchBarFdpOpen
              }
              backgroundColor={pink[500]}
              title='Welcome to PostGUI'
              customPaddingLeft={8.5}
              subtractFromTopPos={0}
              opacity={0.95}
              description='Choose a table to query from the database schema.'
            >
              <IconButton
                color='inherit'
                aria-label='Menu'
                onClick={this.props.toggleLeftPane.bind(this)}
              >
                <MenuIcon />
              </IconButton>
            </FeatureDiscoveryPrompt>

            <Typography
              variant='h6'
              color='inherit'
              style={styleSheet.dbTitleFlex}
            >
              {dbTitle}
            </Typography>

            <div style={styleSheet.searchBarFlex}>
              <FeatureDiscoveryPrompt
                onClose={() => this.setState({isSearchBarFdpOpen: false})}
                open={this.state.isSearchBarFdpOpen}
                backgroundColor={indigo[500]}
                title='Search Tables and Columns'
                customPaddingLeft={2}
                subtractFromTopPos={200}
                opacity={0.95}
                description="Can also tag each term with '[table]' or '[column]'. For example, people[table] firstname[column]."
              >
                <TextField
                  id='search'
                  placeholder='Search'
                  onKeyPress={this.changeSearchTerm.bind(this)}
                  onChange={this.changeSearchTerm.bind(this)}
                  onFocus={this.changeSearchTerm.bind(this)}
                  type='search'
                  style={{...styleSheet.searchBar, ...searchBarFdpOpenStyles}}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SearchIcon
                          style={
                            this.state.isSearchBarFdpOpen
                              ? {fill: 'rgba(0,0,0,0.5)'}
                              : {fill: 'rgba(255,255,255,0.75)'}
                          }
                        />
                      </InputAdornment>
                    )
                  }}
                  autoComplete='off'
                  autoCorrect='off'
                  autoCapitalize='off'
                  spellCheck='false'
                />
              </FeatureDiscoveryPrompt>
            </div>
            <IconButton
              style={styleSheet.rightIconsFlex}
              color='inherit'
              aria-label='History'
              onClick={this.props.toggleHistoryPane.bind(this)}
            >
              <HistoryIcon style={styleSheet.floatRight} />
            </IconButton>
            <IconButton
              style={styleSheet.rightIconsFlex}
              color='inherit'
              aria-label='Help'
              onClick={this.handleHelpToggle}
            >
              <HelpIcon style={styleSheet.floatRight} />
            </IconButton>
            <FeatureDiscoveryPrompt
              onClose={() => {
                this.setState({isLoginFdpOpen: false})
              }}
              open={
                (!this.props.isLoggedIn &&
                  this.state.isLoginFdpOpen &&
                  !this.state.isSearchBarFdpOpen &&
                  !(
                    !this.props.leftPaneVisibility &&
                    this.props.table === '' &&
                    !this.state.isSearchBarFdpOpen
                  )) ||
                false
              }
              backgroundColor={pink[500]}
              title='Private Database'
              subtractFromTopPos={50}
              opacity={0.95}
              description='Provide your credentials for full access.'
            >
              <Button
                onClick={() => {
                  this.handleLoginButtonClick()
                }}
                color='default'
                variant='contained'
                style={styleSheet.rightIconsFlex}
              >
                {this.props.isLoggedIn ? 'Logout' : 'Login'}
              </Button>
            </FeatureDiscoveryPrompt>
          </Toolbar>
          <LoginDialog
            dbName={dbTitle.replace('Database', 'db').replace('database', 'db')}
            setUserEmailPassword={this.props.setUserEmailPassword}
            open={this.state.loginDialogOpen}
            handleLoginDialogCloseClick={this.handleLoginDialogCloseClick}
          />
          <Help
            open={this.state.isHelpOpen}
            handleHelpToggle={this.handleHelpToggle}
          />
        </AppBar>
      </>
    )
  }
}

const styleSheet = {
  dbTitleFlex: {
    flex: 0.3
  },
  searchBarFlex: {
    flex: 0.6,
    display: 'block',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 0
  },
  searchBar: {
    marginLeft: 5,
    marginRight: 5,
    background: 'white',
    padding: 10,
    paddingBottom: 5,
    borderRadius: 3,
    float: 'right',
    transition: 'all 0.2s'
  },
  rightIconsFlex: {
    flex: 0.05,
    display: 'block'
  },
  floatRight: {
    float: 'right'
  },
  floatRightPadded: {
    float: 'right',
    marginRight: 5
  },
  button: {
    margin: 15
  }
}
