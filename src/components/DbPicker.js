import React, { Component } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

let lib = require("../utils/library.js");

export default class DbPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: undefined,
      open: false,
      databases: []
    };
  }

  //button = undefined;

  handleClickListItem = event => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleMenuItemClick = (event, index) => {
    this.setState({ open: false });
    this.props.changeDbIndex(index);
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  // get a list of databases in the config.json
  componentDidMount() {
    let databasesMapped = [];
    lib
      .getValueFromConfig("databases")
      .map(
        (obj, index) =>
          (databasesMapped[index] = obj.title || "Untitled database")
      );
    this.setState({
      databases: databasesMapped
    });
  }

  render() {
    return (
      <div style={styleSheet.root}>
        <List>
          <ListItem
            button
            aria-haspopup="true"
            aria-controls="lock-menu"
            aria-label="Database"
            onClick={this.handleClickListItem}
          >
            <ListItemText
              primary="Database"
              secondary={this.state.databases[this.props.dbIndex]}
            />
          </ListItem>
        </List>
        <Menu
          id="lock-menu"
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onClose={this.handleRequestClose}
        >
          {this.state.databases.map((option, index) => (
            <MenuItem
              key={option}
              selected={index === this.props.dbIndex}
              onClick={event => this.handleMenuItemClick(event, index)}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

const styleSheet = {
  root: {
    width: "99%"
  }
};
