import React, { Component } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';


const lib = require('../utils/library.ts')

interface IDbPickerProps {
  changeDbIndex: Function
  dbIndex: number
}

interface IDbPickerState {
  anchorEl: Maybe<HTMLElement>
  open: boolean
  databases: Array<string>
}

export default class DbPicker extends Component<
  IDbPickerProps,
  IDbPickerState
> {
  constructor(props: IDbPickerProps) {
    super(props)
    this.state = {
      anchorEl: undefined,
      open: false,
      databases: []
    }
  }

  handleClickListItem = (event: any) => {
    this.setState({open: true, anchorEl: event.currentTarget})
  }

  handleMenuItemClick = (event: any, index: number) => {
    this.setState({open: false})
    this.props.changeDbIndex(index)
  }

  handleRequestClose = () => {
    this.setState({open: false})
  }

  // get a list of databases in the config.json
  componentDidMount() {
    const databasesMapped: Array<string> = []
    lib
      .getValueFromConfig('databases')
      .map(
        (obj: any, index: number) =>
          (databasesMapped[index] = obj.title || 'Untitled database')
      )
    this.setState({
      databases: databasesMapped
    })
  }

  render() {
    return (
      <>
        <List>
          <ListItem
            button
            aria-haspopup='true'
            aria-controls='lock-menu'
            aria-label='Database'
            onClick={this.handleClickListItem}
          >
            <ListItemText
              primary='Database'
              secondary={this.state.databases[this.props.dbIndex]}
            />
          </ListItem>
        </List>
        <Menu
          id='lock-menu'
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onClose={this.handleRequestClose}
        >
          {this.state.databases.map((option: any, index: number) => (
            <MenuItem
              key={option}
              selected={index === this.props.dbIndex}
              onClick={(event) => this.handleMenuItemClick(event, index)}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </>
    )
  }
}
